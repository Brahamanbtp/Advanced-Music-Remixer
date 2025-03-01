import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { useAudio } from '../contexts/AudioContext';

const TransportControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [loop, setLoop] = useState(false);
  const [position, setPosition] = useState("0:0:0");
  const lastTapTimeRef = useRef(null);
  const positionRef = useRef(null);
  const { startAudioContext } = useAudio();

  // Smooth position updates
  const syncPosition = useCallback(() => {
    if (!isPlaying) return;
    setPosition(Tone.Transport.position);
    positionRef.current = requestAnimationFrame(syncPosition);
  }, [isPlaying]);

  useEffect(() => {
    // Ensure AudioContext is started properly
    const handleStartAudioContext = async () => {
      await startAudioContext();
      await Tone.start();
      console.log("AudioContext started!");
    };

    document.body.addEventListener("click", handleStartAudioContext, { once: true });

    return () => {
      if (positionRef.current) {
        cancelAnimationFrame(positionRef.current);
      }
    };
  }, [startAudioContext]);

  const start = async () => {
    await Tone.start();
    Tone.Transport.start();
    setIsPlaying(true);
    syncPosition();
  };

  const stop = () => {
    Tone.Transport.stop();
    setIsPlaying(false);
    if (positionRef.current) {
      cancelAnimationFrame(positionRef.current);
    }
  };

  const toggleLoop = () => {
    const newLoopState = !loop;
    Tone.Transport.loop = newLoopState;
    setLoop(newLoopState);
  };

  const setBpmValue = (value) => {
    const newBpm = Math.max(60, Math.min(240, parseFloat(value)));
    Tone.Transport.bpm.value = newBpm;
    setBpm(newBpm);
  };

  const rewind = () => {
    Tone.Transport.position = "0:0:0";
    setPosition("0:0:0");
  };

  const tapTempo = () => {
    const currentTime = Tone.now();
    if (lastTapTimeRef.current) {
      const timeDiff = currentTime - lastTapTimeRef.current;
      const newBpm = Math.round(60 / timeDiff);
      setBpmValue(newBpm);
    }
    lastTapTimeRef.current = currentTime;
  };

  return (
    <div className="transport-controls">
      <button onClick={isPlaying ? stop : start}>{isPlaying ? 'Stop' : 'Play'}</button>
      <button onClick={rewind}>Rewind</button>
      <button onClick={toggleLoop}>{loop ? 'Loop Off' : 'Loop On'}</button>
      <button onClick={tapTempo}>Tap Tempo</button>
      <label>
        BPM
        <input
          type="number"
          value={bpm}
          onChange={(e) => setBpmValue(e.target.value)}
          min="60"
          max="240"
        />
      </label>
      <div className="position-display">Position: {position}</div>
    </div>
  );
};

export default TransportControls;

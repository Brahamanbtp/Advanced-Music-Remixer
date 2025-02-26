import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { useAudio } from '../contexts/AudioContext';

const TransportControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [loop, setLoop] = useState(false);
  const [position, setPosition] = useState("0:0:0"); // Default Tone.js format
  const { startAudioContext } = useAudio();

  useEffect(() => {
    const syncPosition = () => {
      setPosition(Tone.Transport.position);
    };

    // Ensure AudioContext starts only after user interaction
    const handleStartAudioContext = async () => {
      startAudioContext();
      await Tone.start();
      console.log("AudioContext started!");
    };

    document.body.addEventListener("click", handleStartAudioContext, { once: true });

    Tone.Transport.on('transport', syncPosition);

    return () => {
      Tone.Transport.off('transport', syncPosition);
    };
  }, [startAudioContext]);

  const start = async () => {
    await Tone.start(); // Ensures AudioContext is started properly
    Tone.Transport.start();
    setIsPlaying(true);
  };

  const stop = () => {
    Tone.Transport.stop();
    setIsPlaying(false);
  };

  const toggleLoop = () => {
    Tone.Transport.loop = !loop;
    setLoop(!loop);
  };

  const setBpmValue = (value) => {
    Tone.Transport.bpm.value = parseFloat(value);
    setBpm(value);
  };

  const rewind = () => {
    Tone.Transport.position = "0:0:0";
    setPosition("0:0:0");
  };

  return (
    <div className="transport-controls">
      <button onClick={isPlaying ? stop : start}>{isPlaying ? 'Stop' : 'Play'}</button>
      <button onClick={rewind}>Rewind</button>
      <button onClick={toggleLoop}>{loop ? 'Loop Off' : 'Loop On'}</button>
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
      <div className="position-display">
        Position: {position}
      </div>
    </div>
  );
};

export default TransportControls;

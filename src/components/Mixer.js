import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import Effect from './Effect';

const Mixer = ({ tracks }) => {
  const [masterVolume, setMasterVolume] = useState(1);
  const [sendLevel, setSendLevel] = useState(0);
  const [effectsBypassed, setEffectsBypassed] = useState({
    reverb: false,
    delay: false,
  });

  // Ensure audio context starts on user interaction
  const startAudioContext = async () => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
      console.log('Audio context started');
    }
  };

  // Use refs to persist effects across renders
  const reverbRef = useRef(null);
  const delayRef = useRef(null);

  useEffect(() => {
    reverbRef.current = new Tone.Reverb().toDestination();
    delayRef.current = new Tone.FeedbackDelay().toDestination();

    return () => {
      if (reverbRef.current) {
        reverbRef.current.disconnect();
        reverbRef.current.dispose();
      }
      if (delayRef.current) {
        delayRef.current.disconnect();
        delayRef.current.dispose();
      }
    };
  }, []);

  const applySendEffect = (track) => {
    if (!track?.synth) {
      console.warn('Skipping effect application: Synth not initialized for track', track);
      return;
    }

    const reverb = reverbRef.current;
    const delay = delayRef.current;

    if (!effectsBypassed.reverb && reverb) {
      track.synth.connect(reverb);
      reverb.wet.value = sendLevel;
    } else {
      track.synth.disconnect(reverb);
    }

    if (!effectsBypassed.delay && delay) {
      track.synth.connect(delay);
      delay.wet.value = sendLevel;
    } else {
      track.synth.disconnect(delay);
    }
  };

  const toggleEffectBypass = (effect) => {
    setEffectsBypassed((prev) => ({
      ...prev,
      [effect]: !prev[effect],
    }));
  };

  return (
    <div className="mixer">
      <button onClick={startAudioContext}>Start Audio</button>

      <div className="master-controls">
        <h4>Master Volume</h4>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={masterVolume}
          onChange={(e) => {
            const volume = parseFloat(e.target.value);
            setMasterVolume(volume);
            Tone.Destination.volume.value = Tone.gainToDb(volume);
          }}
        />
      </div>

      {tracks.map((track, index) => (
        <div key={index} className="mixer-track">
          <h4>{track.name}</h4>

          <label>
            Volume
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue="1"
              onChange={(e) => {
                if (track.synth) {
                  track.synth.volume.value = Tone.gainToDb(parseFloat(e.target.value));
                }
              }}
            />
          </label>

          <label>
            Send Level
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sendLevel}
              onChange={(e) => {
                setSendLevel(parseFloat(e.target.value));
                applySendEffect(track);
              }}
            />
          </label>

          <div className="effects">
            {['reverb', 'delay', 'distortion', 'chorus'].map((effectType) => (
              <Effect key={effectType} effectType={effectType} track={track} />
            ))}
          </div>

          <div className="effect-bypass">
            {['reverb', 'delay'].map((effect) => (
              <button key={effect} onClick={() => toggleEffectBypass(effect)}>
                {effectsBypassed[effect] ? 'Enable' : 'Bypass'} {effect.charAt(0).toUpperCase() + effect.slice(1)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Mixer;
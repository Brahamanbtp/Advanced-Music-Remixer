import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import Effect from './Effect';

const Mixer = ({ tracks }) => {
  const [masterVolume, setMasterVolume] = useState(1);
  const [sendLevel, setSendLevel] = useState(0);
  const [effectsBypassed, setEffectsBypassed] = useState({
    reverb: false,
    delay: false,
  });

  const reverb = new Tone.Reverb().toDestination();
  const delay = new Tone.FeedbackDelay().toDestination();

  useEffect(() => {
    return () => {
      reverb.disconnect();
      delay.disconnect();
      reverb.dispose();
      delay.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applySendEffect = (track) => {
    if (!effectsBypassed.reverb) {
      track.synth.connect(reverb);
      reverb.wet.value = sendLevel;
    }
    if (!effectsBypassed.delay) {
      track.synth.connect(delay);
      delay.wet.value = sendLevel;
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
      <div className="master-controls">
        <h4>Master Volume</h4>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={masterVolume}
          onChange={(e) => {
            setMasterVolume(e.target.value);
            Tone.Destination.volume.value = e.target.value;
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
              onChange={(e) => (track.synth.volume.value = e.target.value)}
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
                setSendLevel(e.target.value);
                applySendEffect(track);
              }}
            />
          </label>
          <div className="effects">
            <Effect effectType="reverb" track={track} />
            <Effect effectType="delay" track={track} />
            <Effect effectType="distortion" track={track} />
            <Effect effectType="chorus" track={track} />
          </div>
          <div className="effect-bypass">
            <button onClick={() => toggleEffectBypass('reverb')}>
              {effectsBypassed.reverb ? 'Enable' : 'Bypass'} Reverb
            </button>
            <button onClick={() => toggleEffectBypass('delay')}>
              {effectsBypassed.delay ? 'Enable' : 'Bypass'} Delay
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Mixer;

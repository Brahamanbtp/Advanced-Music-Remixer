import React, { useState } from 'react';
import * as Tone from 'tone';
import Effect from './Effect';

const Mixer = ({ tracks }) => {
  const [masterVolume, setMasterVolume] = useState(1);
  const [sendLevel, setSendLevel] = useState(0);
  const reverb = new Tone.Reverb().toDestination();
  const delay = new Tone.FeedbackDelay().toDestination();

  const applySendEffect = (track) => {
    track.synth.connect(reverb);
    track.synth.connect(delay);
    reverb.wet.value = sendLevel;
    delay.wet.value = sendLevel;
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
        </div>
      ))}
    </div>
  );
};

export default Mixer;
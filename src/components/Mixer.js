import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import Effect from './Effect';

const Mixer = ({ tracks, setTracks }) => {
  const [masterVolume, setMasterVolume] = useState(1);
  const [sendLevel, setSendLevel] = useState(0);
  const [effectsBypassed, setEffectsBypassed] = useState({
    reverb: false,
    delay: false,
  });

  const reverbRef = useRef(null);
  const delayRef = useRef(null);
  const gainRef = useRef(null);

  useEffect(() => {
    if (Tone.context.state !== 'running') {
      Tone.start().catch((err) => console.error('🚨 Failed to start AudioContext:', err));
    }
  }, []);

  useEffect(() => {
    const initializeAudio = async () => {
      if (Tone.context.state !== 'running') {
        console.warn('⚠️ AudioContext is not ready. Skipping mixer setup.');
        return;
      }

      try {
        gainRef.current = new Tone.Gain(0.8).toDestination();
        reverbRef.current = new Tone.Reverb({ decay: 3, wet: sendLevel }).connect(gainRef.current);
        delayRef.current = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.5, wet: sendLevel }).connect(gainRef.current);

        console.log('✅ Mixer initialized successfully');
      } catch (error) {
        console.error('🚨 Error setting up Mixer:', error);
      }
    };

    initializeAudio();

    return () => {
      console.log('🛑 Cleaning up Mixer effects...');
      [reverbRef, delayRef, gainRef].forEach((ref) => {
        if (ref.current) {
          ref.current.disconnect();
          ref.current.dispose();
          ref.current = null;
        }
      });
    };
  }, [sendLevel]);

  const applySendEffect = (track) => {
    if (!track?.synth || Tone.context.state !== 'running') {
      console.warn('⚠️ Skipping effect application: AudioContext not running or Synth not initialized');
      return;
    }

    const reverb = reverbRef.current;
    const delay = delayRef.current;

    if (reverb && !effectsBypassed.reverb) {
      track.synth.connect(reverb);
      reverb.wet.value = sendLevel;
    } else {
      track.synth.disconnect(reverb);
    }

    if (delay && !effectsBypassed.delay) {
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

  const removeTrack = (trackIndex) => {
    setTracks((prevTracks) => prevTracks.filter((_, index) => index !== trackIndex));
  };

  return (
    <div className="mixer">
      <button onClick={() => Tone.start()}>🎵 Start Audio</button>

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
            if (Tone.context.state === 'running') {
              Tone.Destination.volume.value = Tone.gainToDb(volume);
            }
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

          <button onClick={() => removeTrack(index)}>❌ Remove Track</button>
        </div>
      ))}
    </div>
  );
};

export default Mixer;

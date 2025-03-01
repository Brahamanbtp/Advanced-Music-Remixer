import React, { useState, useEffect, useMemo } from 'react';
import * as Tone from 'tone';

const Effect = ({ effectType, track }) => {
  const [effect, setEffect] = useState(null);
  const [wetValue, setWetValue] = useState(0.5);
  const [parameters, setParameters] = useState({});
  const [preset, setPreset] = useState('default');

  useEffect(() => {
    if (Tone.context.state !== 'running') {
      Tone.start().catch((err) => console.error('🚨 Failed to start AudioContext:', err));
    }
  }, []);

  const createEffect = useMemo(() => {
    if (!effectType || !track?.synth) {
      console.warn('⚠️ No valid effectType or synth.');
      return null;
    }

    let newEffect;
    try {
      switch (effectType.toLowerCase()) {
        case 'reverb':
          newEffect = new Tone.Reverb({ wet: wetValue, decay: 2.5, preDelay: 0.02 });
          break;
        case 'delay':
          newEffect = new Tone.FeedbackDelay({ wet: wetValue, feedback: 0.6, delayTime: '8n' });
          break;
        case 'distortion':
          newEffect = new Tone.Distortion({ wet: wetValue, distortion: 0.4, oversample: '4x' });
          break;
        case 'chorus':
          newEffect = new Tone.Chorus({ wet: wetValue, frequency: 1.5, delayTime: 3.5, depth: 0.7 });
          break;
        default:
          console.warn(`⚠️ Unknown effect type: "${effectType}". Defaulting to Reverb.`);
          newEffect = new Tone.Reverb({ wet: wetValue });
      }

      newEffect.toDestination();
      return newEffect;
    } catch (error) {
      console.error('🚨 Error creating effect:', error);
      return null;
    }
  }, [effectType, wetValue, track?.synth]);

  useEffect(() => {
    if (!track?.synth || !createEffect) return;

    track.synth.connect(createEffect);
    setEffect(createEffect);

    return () => {
      if (createEffect) {
        console.log(`🛑 Cleaning up ${effectType} effect...`);
        track.synth.disconnect(createEffect);
        createEffect.disconnect();
        createEffect.dispose();
      }
    };
  }, [effectType, track, createEffect]);

  useEffect(() => {
    if (effect) {
      setParameters(effect.get());
    }
  }, [effect]);

  const handleParameterChange = (param, value) => {
    if (effect && param in effect) {
      effect.set({ [param]: value });
      setParameters((prevParams) => ({ ...prevParams, [param]: value }));
    } else {
      console.warn(`⚠️ Parameter "${param}" is not valid for ${effectType}`);
    }
  };

  const applyPreset = (presetName) => {
    const presets = {
      default: { wet: 0.5 },
      intense: { wet: 0.8, feedback: 0.7, delayTime: '16n', distortion: 0.7 },
      subtle: { wet: 0.3, feedback: 0.3, delayTime: '4n', distortion: 0.2 },
    };

    const presetValues = presets[presetName] || presets.default;
    Object.entries(presetValues).forEach(([param, value]) => {
      handleParameterChange(param, value);
    });
    setPreset(presetName);
  };

  if (!track?.synth) {
    return <div className="effect">No track or synth available.</div>;
  }

  return (
    <div className="effect">
      <h4>{effectType.charAt(0).toUpperCase() + effectType.slice(1)}</h4>

      <label>
        Wet
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={wetValue}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            setWetValue(newValue);
            handleParameterChange('wet', newValue);
          }}
        />
      </label>

      {Object.keys(parameters).map((param) => (
        <label key={param}>
          {param.charAt(0).toUpperCase() + param.slice(1)}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={parameters[param]}
            onChange={(e) => handleParameterChange(param, parseFloat(e.target.value))}
          />
        </label>
      ))}

      <div>
        <h5>Presets</h5>
        <button onClick={() => applyPreset('default')} disabled={preset === 'default'}>
          Default
        </button>
        <button onClick={() => applyPreset('intense')} disabled={preset === 'intense'}>
          Intense
        </button>
        <button onClick={() => applyPreset('subtle')} disabled={preset === 'subtle'}>
          Subtle
        </button>
        <p>Current Preset: {preset}</p>
      </div>
    </div>
  );
};

export default Effect;

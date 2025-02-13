import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

const Effect = ({ effectType, track }) => {
  const [effect, setEffect] = useState(null);
  const [wetValue, setWetValue] = useState(0);
  const [parameters, setParameters] = useState({});

  useEffect(() => {
    let newEffect;
    switch (effectType) {
      case 'reverb':
        newEffect = new Tone.Reverb({
          wet: wetValue,
        }).toDestination();
        break;
      case 'delay':
        newEffect = new Tone.FeedbackDelay({
          wet: wetValue,
          feedback: 0.5,
          delayTime: '8n',
        }).toDestination();
        break;
      case 'distortion':
        newEffect = new Tone.Distortion({
          wet: wetValue,
          distortion: 0.5,
        }).toDestination();
        break;
      case 'chorus':
        newEffect = new Tone.Chorus({
          wet: wetValue,
          frequency: 1.5,
          delayTime: 3.5,
          depth: 0.7,
          type: 'sine',
        }).toDestination();
        break;
      default:
        newEffect = new Tone.Reverb().toDestination();
    }

    setEffect(newEffect);
    track.synth.connect(newEffect);

    return () => {
      newEffect.disconnect();
      newEffect.dispose();
    };
  }, [effectType, track, wetValue]);

  useEffect(() => {
    if (effect) {
      const params = effect.get();
      setParameters(params);
    }
  }, [effect]);

  const handleParameterChange = (param, value) => {
    if (effect) {
      effect.set({ [param]: value });
      setParameters((prevParams) => ({ ...prevParams, [param]: value }));
    }
  };

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
            setWetValue(e.target.value);
            handleParameterChange('wet', e.target.value);
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
            onChange={(e) => handleParameterChange(param, e.target.value)}
          />
        </label>
      ))}
    </div>
  );
};

export default Effect;

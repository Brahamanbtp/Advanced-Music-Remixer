import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

const Sequencer = ({ synth }) => {
  const [sequence, setSequence] = useState(['C4', 'E4', 'G4', 'B4']);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const loop = new Tone.Loop((time) => {
      sequence.forEach((note, index) => {
        if (index === step) {
          synth.triggerAttackRelease(note, '8n', time);
        }
      });
      setStep((prevStep) => (prevStep + 1) % sequence.length);
    }, '8n').start(0);

    Tone.Transport.start();

    return () => {
      loop.dispose();
    };
  }, [sequence, synth, step]);

  const togglePlay = () => {
    if (isPlaying) {
      Tone.Transport.stop();
    } else {
      Tone.Transport.start();
    }
    setIsPlaying(!isPlaying);
  };

  const updateSequence = (index, note) => {
    const newSequence = [...sequence];
    newSequence[index] = note;
    setSequence(newSequence);
  };

  const addStep = () => {
    setSequence([...sequence, 'C4']);
  };

  const removeStep = (index) => {
    const newSequence = sequence.filter((_, i) => i !== index);
    setSequence(newSequence);
  };

  return (
    <div className="sequencer">
      <h4>Sequencer</h4>
      <button onClick={togglePlay}>{isPlaying ? 'Stop' : 'Play'}</button>
      <div className="steps">
        {sequence.map((note, index) => (
          <div key={index} className="step">
            <input
              type="text"
              value={note}
              onChange={(e) => updateSequence(index, e.target.value)}
            />
            <button onClick={() => removeStep(index)}>Remove</button>
          </div>
        ))}
      </div>
      <button onClick={addStep}>Add Step</button>
    </div>
  );
};

export default Sequencer;

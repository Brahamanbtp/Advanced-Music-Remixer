import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

const Sequencer = ({ synth }) => {
  const [sequence, setSequence] = useState(['C4', 'E4', 'G4', 'B4']);
  const [isPlaying, setIsPlaying] = useState(false);
  const sequenceRef = useRef(sequence);
  const partRef = useRef(null);

  useEffect(() => {
    sequenceRef.current = sequence;
  }, [sequence]);

  useEffect(() => {
    // Ensure AudioContext is running
    if (Tone.context.state !== 'running') {
      Tone.start();
    }

    if (partRef.current) {
      partRef.current.dispose();
    }

    // Create a Tone.Part to ensure proper timing
    partRef.current = new Tone.Part((time, note) => {
      synth.triggerAttackRelease(note, '8n', time);
    }, sequence.map((note, i) => [i * 0.5, note])); // Ensures strictly increasing times

    partRef.current.loop = true;
    partRef.current.loopEnd = `${sequence.length * 0.5}s`;
    partRef.current.start(0);

    return () => {
      if (partRef.current) {
        partRef.current.dispose();
      }
    };
  }, [sequence, synth]);

  const togglePlay = async () => {
    if (isPlaying) {
      Tone.Transport.stop();
    } else {
      await Tone.start(); // Ensures user interaction starts AudioContext
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

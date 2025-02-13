import React, { useState } from 'react';
import * as Tone from 'tone';

const PianoRoll = ({ synth }) => {
  const [notes, setNotes] = useState([]);
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octaves = [3, 4, 5];

  const addNote = (note, time) => {
    setNotes([...notes, { note, time }]);
    synth.triggerAttackRelease(note, '8n', time);
  };

  const renderPianoRoll = () => {
    return octaves.map((octave) => (
      <div key={octave} className="octave">
        {noteNames.map((note, index) => (
          <div
            key={index}
            className="note"
            onClick={() => addNote(`${note}${octave}`, Tone.now())}
          >
            {note}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="piano-roll">
      <h4>Piano Roll</h4>
      <div className="note-grid">{renderPianoRoll()}</div>
    </div>
  );
};

export default PianoRoll;

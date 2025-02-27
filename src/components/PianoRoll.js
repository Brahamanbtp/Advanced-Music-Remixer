import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

const PianoRoll = ({ synth }) => {
  const [activeNotes, setActiveNotes] = useState([]);
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octaves = [3, 4, 5];

  const addNote = (note, time) => {
    synth.triggerAttackRelease(note, '8n', time);
    setActiveNotes((prevActiveNotes) => [...prevActiveNotes, note]);

    // Remove the note from active notes after the duration
    setTimeout(() => {
      setActiveNotes((prevActiveNotes) => prevActiveNotes.filter((n) => n !== note));
    }, Tone.Time('8n').toMilliseconds());
  };

  const removeNote = (note) => {
    setActiveNotes((prevActiveNotes) => prevActiveNotes.filter((n) => n !== note));
  };

  const renderPianoRoll = () => {
    return octaves.map((octave) => (
      <div key={octave} className="octave">
        {noteNames.map((note, index) => {
          const fullNote = `${note}${octave}`;
          const isActive = activeNotes.includes(fullNote);
          return (
            <div
              key={index}
              className={`note ${isActive ? 'active' : ''}`}
              onClick={() => addNote(fullNote, Tone.now())}
              onContextMenu={(e) => {
                e.preventDefault();
                removeNote(fullNote);
              }}
            >
              {note}
            </div>
          );
        })}
      </div>
    ));
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      const noteMap = {
        a: 'C4',
        w: 'C#4',
        s: 'D4',
        e: 'D#4',
        d: 'E4',
        f: 'F4',
        t: 'F#4',
        g: 'G4',
        y: 'G#4',
        h: 'A4',
        u: 'A#4',
        j: 'B4',
        k: 'C5',
      };
      if (noteMap[event.key]) {
        addNote(noteMap[event.key], Tone.now());
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="piano-roll">
      <h4>Piano Roll</h4>
      <div className="note-grid">{renderPianoRoll()}</div>
    </div>
  );
};

export default PianoRoll;

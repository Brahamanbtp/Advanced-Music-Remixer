import { useState, useEffect } from 'react';

const useMidi = (onMidiMessage) => {
  const [midiAccess, setMidiAccess] = useState(null);

  useEffect(() => {
    const setupMidi = async () => {
      try {
        const access = await navigator.requestMIDIAccess();
        setMidiAccess(access);

        access.inputs.forEach((input) => {
          input.onmidimessage = onMidiMessage;
        });
      } catch (error) {
        console.error('Error accessing MIDI devices:', error);
      }
    };

    setupMidi();

    // Clean up the effect
    return () => {
      if (midiAccess) {
        midiAccess.inputs.forEach((input) => {
          input.onmidimessage = null;
        });
      }
    };
  }, [onMidiMessage]);

  return midiAccess;
};

export default useMidi;

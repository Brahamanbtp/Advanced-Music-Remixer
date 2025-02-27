import { useState, useEffect, useCallback } from 'react';

const useMidi = (onMidiMessage) => {
  const [midiAccess, setMidiAccess] = useState(null);

  const handleMidiMessage = useCallback((event) => {
    onMidiMessage(event);
  }, [onMidiMessage]);

  useEffect(() => {
    const setupMidi = async () => {
      try {
        const access = await navigator.requestMIDIAccess();
        setMidiAccess(access);

        access.inputs.forEach((input) => {
          input.onmidimessage = handleMidiMessage;
        });

        access.onstatechange = (event) => {
          if (event.port.state === 'disconnected') {
            console.warn('MIDI device disconnected:', event.port);
            setMidiAccess((prevAccess) => {
              const updatedInputs = prevAccess.inputs.filter(
                (input) => input !== event.port
              );
              return { ...prevAccess, inputs: updatedInputs };
            });
          } else if (event.port.state === 'connected') {
            console.log('MIDI device connected:', event.port);
            event.port.onmidimessage = handleMidiMessage;
          }
        };
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
  }, [handleMidiMessage]);

  return midiAccess;
};

export default useMidi;

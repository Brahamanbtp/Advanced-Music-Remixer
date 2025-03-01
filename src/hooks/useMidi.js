import { useState, useEffect, useCallback, useRef } from 'react';

const useMidi = (onMidiMessage) => {
  const [midiAccess, setMidiAccess] = useState(null);
  const midiInputsRef = useRef(new Map());

  const handleMidiMessage = useCallback((event) => {
    if (onMidiMessage && typeof onMidiMessage === 'function') {
      onMidiMessage(event);
    }
  }, [onMidiMessage]);

  useEffect(() => {
    const setupMidi = async () => {
      try {
        const access = await navigator.requestMIDIAccess();
        setMidiAccess(access);

        const handlePortChange = (event) => {
          const { port } = event;
          if (port.type === 'input') {
            if (port.state === 'connected' && !midiInputsRef.current.has(port.id)) {
              console.log('MIDI device connected:', port.name);
              port.onmidimessage = handleMidiMessage;
              midiInputsRef.current.set(port.id, port);
            } else if (port.state === 'disconnected') {
              console.warn('MIDI device disconnected:', port.name);
              if (midiInputsRef.current.has(port.id)) {
                midiInputsRef.current.delete(port.id);
              }
            }
          }
        };

        access.inputs.forEach((input) => {
          input.onmidimessage = handleMidiMessage;
          midiInputsRef.current.set(input.id, input);
        });

        access.onstatechange = handlePortChange;
      } catch (error) {
        console.error('Error accessing MIDI devices:', error);
      }
    };

    setupMidi();

    return () => {
      midiInputsRef.current.forEach((input) => {
        input.onmidimessage = null;
      });
      midiInputsRef.current.clear();
    };
  }, [handleMidiMessage]);

  return midiAccess;
};

export default useMidi;

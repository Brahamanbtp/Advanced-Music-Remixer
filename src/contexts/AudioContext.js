import React, { createContext, useState, useContext, useRef } from 'react';

// Create a context for managing audio-related state
export const AudioContext = createContext();

// Create a provider component to manage audio state
export const AudioProvider = ({ children }) => {
  const [automation, setAutomation] = useState([]);
  const audioContextRef = useRef(null);

  // Function to initialize or resume the AudioContext
  const startAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  // Function to add an automation point
  const addAutomationPoint = (parameter, time, value) => {
    setAutomation((prevAutomation) => [
      ...prevAutomation,
      { parameter, time, value },
    ]);
  };

  return (
    <AudioContext.Provider value={{ automation, addAutomationPoint, startAudioContext }}>
      {children}
    </AudioContext.Provider>
  );
};

// Custom hook to use the AudioContext
export const useAudio = () => {
  return useContext(AudioContext);
};

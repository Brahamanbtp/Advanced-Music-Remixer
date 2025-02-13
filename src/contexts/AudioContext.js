import React, { createContext, useState, useContext } from 'react';

// Create a context for managing audio-related state
export const AudioContext = createContext();

// Create a provider component to manage audio state
export const AudioProvider = ({ children }) => {
  const [automation, setAutomation] = useState([]);

  // Function to add an automation point
  const addAutomationPoint = (parameter, time, value) => {
    setAutomation((prevAutomation) => [
      ...prevAutomation,
      { parameter, time, value },
    ]);
  };

  return (
    <AudioContext.Provider value={{ automation, addAutomationPoint }}>
      {children}
    </AudioContext.Provider>
  );
};

// Custom hook to use the AudioContext
export const useAudio = () => {
  return useContext(AudioContext);
};

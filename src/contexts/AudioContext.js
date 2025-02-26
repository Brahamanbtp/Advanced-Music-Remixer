import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

// Create a context for managing audio-related state
export const AudioContext = createContext();

// Create a provider component to manage audio state
export const AudioProvider = ({ children }) => {
  const [automation, setAutomation] = useState([]);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const audioContextRef = useRef(null);

  // Function to initialize or resume the AudioContext
  const startAudioContext = async () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        setIsAudioReady(true);
      } catch (error) {
        console.error('Error initializing AudioContext:', error);
      }
    }
    if (audioContextRef.current.state === 'suspended') {
      try {
        await audioContextRef.current.resume();
      } catch (error) {
        console.error('Error resuming AudioContext:', error);
      }
    }
  };

  // Function to add an automation point
  const addAutomationPoint = (parameter, time, value) => {
    setAutomation((prevAutomation) => [
      ...prevAutomation,
      { parameter, time, value },
    ]);
  };

  // Effect to handle AudioContext suspension on page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && audioContextRef.current) {
        startAudioContext();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <AudioContext.Provider value={{ automation, addAutomationPoint, startAudioContext, isAudioReady }}>
      {children}
    </AudioContext.Provider>
  );
};

// Custom hook to use the AudioContext
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

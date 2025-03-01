import React, { createContext, useState, useContext, useRef, useEffect } from "react";

// Create AudioContext
export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [automation, setAutomation] = useState(new Map()); // Efficient automation storage
  const [isAudioReady, setIsAudioReady] = useState(false);
  const audioContextRef = useRef(null);

  // Function to initialize or resume the AudioContext
  const startAudioContext = async () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
          latencyHint: "interactive", // Lower latency for real-time audio
          sampleRate: 44100, // Standard sample rate for high-quality audio
        });
        setIsAudioReady(true);
      } catch (error) {
        console.error("🚨 Error initializing AudioContext:", error);
      }
    }

    if (audioContextRef.current.state === "suspended") {
      try {
        await audioContextRef.current.resume();
        console.log("🔊 AudioContext resumed!");
      } catch (error) {
        console.error("🚨 Error resuming AudioContext:", error);
      }
    }
  };

  // Function to add an automation point efficiently
  const addAutomationPoint = (parameter, time, value) => {
    setAutomation((prevAutomation) => {
      const updatedAutomation = new Map(prevAutomation);
      updatedAutomation.set(time, { parameter, time, value }); // Store unique automation points
      return updatedAutomation;
    });
  };

  // Effect to auto-resume AudioContext when visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && audioContextRef.current) {
        startAudioContext();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Auto-resume on user interaction (helps with iOS autoplay restrictions)
  useEffect(() => {
    const handleUserInteraction = () => {
      startAudioContext();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
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
    throw new Error("🚨 useAudio must be used within an AudioProvider");
  }
  return context;
};

import React, { createContext, useContext, useReducer, useEffect } from "react";
import * as Tone from "tone";

// 🎛 TrackContext for managing tracks
const TrackContext = createContext();

// 🎵 Load initial tracks from localStorage (if available)
const loadInitialTracks = () => {
  try {
    const savedTracks = localStorage.getItem("tracks");
    return savedTracks
      ? JSON.parse(savedTracks).map((track) => ({
          ...track,
          synth: new Tone.Synth().toDestination(),
          effects: track.effects.map((effect) => createEffect(effect.type)),
        }))
      : [];
  } catch (error) {
    console.error("❌ Error loading tracks from storage:", error);
    return [];
  }
};

// 🎛 Utility to create effects dynamically
const createEffect = (type) => {
  switch (type) {
    case "reverb":
      return new Tone.Reverb().toDestination();
    case "delay":
      return new Tone.Delay().toDestination();
    case "chorus":
      return new Tone.Chorus().toDestination();
    default:
      return null;
  }
};

// 🎚 Reducer function to manage track state
const trackReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TRACK":
      const newTrack = {
        id: Date.now(),
        name: `Track ${state.length + 1}`,
        synth: new Tone.Synth().toDestination(),
        effects: [new Tone.Chorus().toDestination()],
      };
      return [...state, newTrack];

    case "REMOVE_TRACK":
      state[action.index].synth.dispose(); // Cleanup synth
      state[action.index].effects.forEach((effect) => effect.dispose()); // Cleanup effects
      return state.filter((_, i) => i !== action.index);

    case "UPDATE_TRACK":
      return state.map((track) =>
        track.id === action.payload.id ? { ...track, ...action.payload } : track
      );

    case "SET_TRACKS":
      return action.payload;

    default:
      console.warn("⚠️ Unknown action type:", action.type);
      return state;
  }
};

// 🎼 TrackProvider component
export const TrackProvider = ({ children }) => {
  const [tracks, dispatch] = useReducer(trackReducer, [], loadInitialTracks);

  // 🎛 Function to add a new track
  const addTrack = () => dispatch({ type: "ADD_TRACK" });

  // 🎚 Function to remove a track
  const removeTrack = (index) => dispatch({ type: "REMOVE_TRACK", index });

  // 🎵 Persist tracks to localStorage on state change
  useEffect(() => {
    const serializedTracks = tracks.map(({ id, name, effects }) => ({
      id,
      name,
      effects: effects.map((effect) => ({ type: effect.constructor.name.toLowerCase() })),
    }));

    localStorage.setItem("tracks", JSON.stringify(serializedTracks));
  }, [tracks]);

  return (
    <TrackContext.Provider value={{ tracks, addTrack, removeTrack }}>
      {children}
    </TrackContext.Provider>
  );
};

// 🎶 Custom hook for accessing TrackContext
export const useTrack = () => {
  const context = useContext(TrackContext);
  if (!context) {
    throw new Error("useTrack must be used within a TrackProvider");
  }
  return context;
};

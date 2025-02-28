import React, { createContext, useContext, useState } from 'react';
import * as Tone from 'tone';

// Create Track Context
const TrackContext = createContext();

// 🎛 TrackProvider for managing tracks
export const TrackProvider = ({ children }) => {
  const [tracks, setTracks] = useState([
    { name: 'Track 1', synth: new Tone.Synth().toDestination(), effects: [new Tone.Reverb().toDestination()] },
    { name: 'Track 2', synth: new Tone.Synth().toDestination(), effects: [new Tone.Delay().toDestination()] },
  ]);

  const addTrack = () => {
    const newTrack = {
      name: `Track ${tracks.length + 1}`,
      synth: new Tone.Synth().toDestination(),
      effects: [new Tone.Chorus().toDestination()],
    };
    setTracks([...tracks, newTrack]);
  };

  const removeTrack = (index) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  return (
    <TrackContext.Provider value={{ tracks, addTrack, removeTrack }}>
      {children}
    </TrackContext.Provider>
  );
};

// 🎵 Hook for accessing track context
export const useTrack = () => useContext(TrackContext);

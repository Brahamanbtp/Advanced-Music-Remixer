import * as Tone from 'tone';

// Function to convert MIDI data to a structured note sequence with timing and velocity
export const midiToNoteSequence = (midiData) => {
  if (!midiData || !midiData.tracks) {
    console.error('Invalid MIDI data provided');
    return [];
  }

  return midiData.tracks.flatMap((track) => {
    let time = 0;
    return track
      .filter((event) => event.type === 'noteOn' && event.velocity > 0)
      .map((event) => {
        time += event.deltaTime;
        return {
          note: Tone.Frequency(event.noteNumber, 'midi').toNote(),
          time,
          velocity: event.velocity / 127, // Normalize velocity to 0-1
        };
      });
  });
};

// Function to quantize MIDI events to a given beat grid
export const quantizeMidiEvents = (midiData, quantizeValue = 16) => {
  if (!midiData || !midiData.tracks) {
    console.error('Invalid MIDI data provided');
    return null;
  }

  return {
    ...midiData,
    tracks: midiData.tracks.map((track) => {
      let time = 0;
      return track.map((event) => {
        time += event.deltaTime;
        const quantizedTime = Math.round(time / quantizeValue) * quantizeValue;
        return { ...event, deltaTime: quantizedTime - (time - event.deltaTime) };
      });
    }),
  };
};

// Function to transpose MIDI notes by a specified interval (in semitones)
export const transposeMidiNotes = (midiData, interval = 0) => {
  if (!midiData || !midiData.tracks) {
    console.error('Invalid MIDI data provided');
    return null;
  }

  return {
    ...midiData,
    tracks: midiData.tracks.map((track) =>
      track.map((event) =>
        event.type === 'noteOn' || event.type === 'noteOff'
          ? { ...event, noteNumber: Math.max(0, Math.min(127, event.noteNumber + interval)) }
          : event
      )
    ),
  };
};

// Function to filter MIDI events by type (e.g., 'noteOn', 'noteOff', 'controlChange')
export const filterMidiEvents = (midiData, eventType) => {
  if (!midiData || !midiData.tracks) {
    console.error('Invalid MIDI data provided');
    return null;
  }

  return {
    ...midiData,
    tracks: midiData.tracks.map((track) => track.filter((event) => event.type === eventType)),
  };
};

// Function to merge multiple MIDI tracks into one, ensuring proper time alignment
export const mergeMidiTracks = (midiData) => {
  if (!midiData || !midiData.tracks) {
    console.error('Invalid MIDI data provided');
    return null;
  }

  const mergedTrack = [];
  let time = 0;

  midiData.tracks.forEach((track) => {
    track.forEach((event) => {
      mergedTrack.push({
        ...event,
        deltaTime: time + event.deltaTime,
      });
      time += event.deltaTime;
    });
  });

  return { ...midiData, tracks: [mergedTrack] };
};

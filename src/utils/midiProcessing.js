// Function to convert MIDI data to a note sequence
export const midiToNoteSequence = (midiData) => {
  const noteSequence = [];

  midiData.tracks.forEach((track) => {
    let time = 0;
    track.forEach((event) => {
      time += event.deltaTime;
      if (event.type === 'noteOn' && event.velocity > 0) {
        noteSequence.push({
          note: Tone.Frequency(event.noteNumber, "midi").toNote(),
          time: time,
          velocity: event.velocity,
        });
      }
    });
  });

  return noteSequence;
};

// Function to quantize MIDI events to the nearest beat
export const quantizeMidiEvents = (midiData, quantizeValue = 16) => {
  const quantizedData = { ...midiData, tracks: [] };

  midiData.tracks.forEach((track) => {
    const quantizedTrack = [];
    let time = 0;

    track.forEach((event) => {
      time += event.deltaTime;
      const quantizedTime = Math.round(time / quantizeValue) * quantizeValue;
      quantizedTrack.push({
        ...event,
        deltaTime: quantizedTime - (time - event.deltaTime),
      });
      time = quantizedTime;
    });

    quantizedData.tracks.push(quantizedTrack);
  });

  return quantizedData;
};

// Function to transpose MIDI notes by a specified interval
export const transposeMidiNotes = (midiData, interval = 0) => {
  const transposedData = { ...midiData, tracks: [] };

  midiData.tracks.forEach((track) => {
    const transposedTrack = track.map((event) => {
      if (event.type === 'noteOn' || event.type === 'noteOff') {
        return {
          ...event,
          noteNumber: event.noteNumber + interval,
        };
      }
      return event;
    });

    transposedData.tracks.push(transposedTrack);
  });

  return transposedData;
};

// Function to filter MIDI events by type
export const filterMidiEvents = (midiData, eventType) => {
  const filteredData = { ...midiData, tracks: [] };

  midiData.tracks.forEach((track) => {
    const filteredTrack = track.filter((event) => event.type === eventType);
    filteredData.tracks.push(filteredTrack);
  });

  return filteredData;
};

// Function to merge multiple MIDI tracks into one
export const mergeMidiTracks = (midiData) => {
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

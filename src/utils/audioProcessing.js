import * as Tone from 'tone';

// Function to normalize audio data
export const normalizeAudio = (audioBuffer) => {
  const data = audioBuffer.getChannelData(0);
  const max = Math.max(...data);
  const min = Math.min(...data);

  // Normalize the audio data
  for (let i = 0; i < data.length; i++) {
    data[i] = (data[i] - min) / (max - min);
  }

  return audioBuffer;
};

// Function to apply a low-pass filter to audio data
export const applyLowPassFilter = (audioBuffer, cutoffFrequency = 1000) => {
  const filter = new Tone.Filter({
    type: 'lowpass',
    frequency: cutoffFrequency,
  });

  const offlineContext = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;

  source.connect(filter);
  filter.connect(offlineContext.destination);
  source.start(0);

  return offlineContext.startRendering().then(() => {
    return offlineContext.createBuffer(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
  });
};

// Function to apply a high-pass filter to audio data
export const applyHighPassFilter = (audioBuffer, cutoffFrequency = 1000) => {
  const filter = new Tone.Filter({
    type: 'highpass',
    frequency: cutoffFrequency,
  });

  const offlineContext = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;

  source.connect(filter);
  filter.connect(offlineContext.destination);
  source.start(0);

  return offlineContext.startRendering().then(() => {
    return offlineContext.createBuffer(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
  });
};

// Function to reverse audio data
export const reverseAudio = (audioBuffer) => {
  const data = audioBuffer.getChannelData(0);
  data.reverse();
  return audioBuffer;
};

// Function to change the playback rate of audio data
export const changePlaybackRate = (audioBuffer, playbackRate = 1.0) => {
  const offlineContext = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length / playbackRate, audioBuffer.sampleRate);
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = playbackRate;

  source.connect(offlineContext.destination);
  source.start(0);

  return offlineContext.startRendering().then(() => {
    return offlineContext.createBuffer(audioBuffer.numberOfChannels, audioBuffer.length / playbackRate, audioBuffer.sampleRate);
  });
};

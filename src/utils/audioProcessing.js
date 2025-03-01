import * as Tone from 'tone';

// Normalize audio data efficiently
export const normalizeAudio = (audioBuffer) => {
  const channelData = audioBuffer.getChannelData(0);
  const max = Math.max(...channelData);
  const min = Math.min(...channelData);

  if (max === min) {
    console.warn('Audio data is constant; normalization skipped.');
    return audioBuffer;
  }

  const range = max - min;
  const normalizedData = new Float32Array(channelData.length);
  for (let i = 0; i < channelData.length; i++) {
    normalizedData[i] = (channelData[i] - min) / range;
  }
  
  const normalizedBuffer = Tone.context.createBuffer(1, channelData.length, audioBuffer.sampleRate);
  normalizedBuffer.copyToChannel(normalizedData, 0);
  return normalizedBuffer;
};

// Apply a filter to audio data (Reusable Function)
const applyFilter = async (audioBuffer, type, cutoffFrequency) => {
  const filter = new Tone.Filter({
    type,
    frequency: cutoffFrequency,
    Q: 1,
  }).toDestination();

  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(filter);
  filter.connect(offlineContext.destination);
  source.start(0);

  return await offlineContext.startRendering();
};

export const applyLowPassFilter = (audioBuffer, cutoffFrequency = 1000) =>
  applyFilter(audioBuffer, 'lowpass', cutoffFrequency);

export const applyHighPassFilter = (audioBuffer, cutoffFrequency = 1000) =>
  applyFilter(audioBuffer, 'highpass', cutoffFrequency);

// Reverse audio buffer efficiently
export const reverseAudio = (audioBuffer) => {
  const reversedBuffer = Tone.context.createBuffer(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const data = audioBuffer.getChannelData(channel);
    const reversedData = new Float32Array(data.length);
    for (let i = 0, len = data.length; i < len; i++) {
      reversedData[i] = data[len - 1 - i];
    }
    reversedBuffer.copyToChannel(reversedData, channel);
  }

  return reversedBuffer;
};

// Change playback rate without distorting pitch
export const changePlaybackRate = async (audioBuffer, playbackRate = 1.0) => {
  const newLength = Math.floor(audioBuffer.length / playbackRate);
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    newLength,
    audioBuffer.sampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = playbackRate;
  source.connect(offlineContext.destination);
  source.start(0);

  return await offlineContext.startRendering();
};

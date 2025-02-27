import * as Tone from 'tone';

// Function to normalize audio data
export const normalizeAudio = (audioBuffer) => {
  const data = audioBuffer.getChannelData(0);
  const max = Math.max(...data);
  const min = Math.min(...data);

  if (max === min) {
    console.warn('Audio data is constant; normalization will have no effect.');
    return audioBuffer;
  }

  // Normalize the audio data
  for (let i = 0; i < data.length; i++) {
    data[i] = (data[i] - min) / (max - min);
  }

  return audioBuffer;
};

// Function to apply a low-pass filter to audio data
export const applyLowPassFilter = async (audioBuffer, cutoffFrequency = 1000) => {
  const filter = new Tone.Filter({
    type: 'lowpass',
    frequency: cutoffFrequency,
    Q: 1, // Quality factor for the filter
  }).toDestination();

  const offlineContext = new OfflineAudioContext({
    numberOfChannels: audioBuffer.numberOfChannels,
    length: audioBuffer.length,
    sampleRate: audioBuffer.sampleRate,
  });

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(filter);
  filter.connect(offlineContext.destination);
  source.start(0);

  const renderedBuffer = await offlineContext.startRendering();
  return renderedBuffer;
};

// Function to apply a high-pass filter to audio data
export const applyHighPassFilter = async (audioBuffer, cutoffFrequency = 1000) => {
  const filter = new Tone.Filter({
    type: 'highpass',
    frequency: cutoffFrequency,
    Q: 1, // Quality factor for the filter
  }).toDestination();

  const offlineContext = new OfflineAudioContext({
    numberOfChannels: audioBuffer.numberOfChannels,
    length: audioBuffer.length,
    sampleRate: audioBuffer.sampleRate,
  });

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(filter);
  filter.connect(offlineContext.destination);
  source.start(0);

  const renderedBuffer = await offlineContext.startRendering();
  return renderedBuffer;
};

// Function to reverse audio data
export const reverseAudio = (audioBuffer) => {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const reversedBuffer = Tone.context.createBuffer(numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);

  for (let channel = 0; channel < numberOfChannels; channel++) {
    const data = audioBuffer.getChannelData(channel);
    const reversedData = reversedBuffer.getChannelData(channel);
    for (let i = 0; i < data.length; i++) {
      reversedData[i] = data[data.length - 1 - i];
    }
  }

  return reversedBuffer;
};

// Function to change the playback rate of audio data
export const changePlaybackRate = async (audioBuffer, playbackRate = 1.0) => {
  const offlineContext = new OfflineAudioContext({
    numberOfChannels: audioBuffer.numberOfChannels,
    length: Math.floor(audioBuffer.length / playbackRate),
    sampleRate: audioBuffer.sampleRate,
  });

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.playbackRate.value = playbackRate;
  source.connect(offlineContext.destination);
  source.start(0);

  const renderedBuffer = await offlineContext.startRendering();
  return renderedBuffer;
};

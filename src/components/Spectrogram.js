import React, { useRef, useEffect, useState } from 'react';
import * as Tone from 'tone';

const Spectrogram = ({ audioBuffer }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fftSize, setFftSize] = useState(2048);
  const [smoothing, setSmoothing] = useState(0.8);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!audioBuffer) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Setup Web Audio Nodes
    const analyser = Tone.context.createAnalyser();
    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = smoothing;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawSpectrogram = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] * (height / 256);
        ctx.fillStyle = `hsl(${(i / bufferLength) * 360}, 100%, 50%)`;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      animationFrameRef.current = requestAnimationFrame(drawSpectrogram);
    };

    const source = Tone.context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);
    source.connect(Tone.context.destination);
    sourceRef.current = source;

    if (isPlaying) {
      source.start();
      drawSpectrogram();
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      source.stop();
      source.disconnect();
      setIsPlaying(false);
    };
  }, [audioBuffer, isPlaying, fftSize, smoothing]);

  const togglePlayback = async () => {
    if (!isPlaying) {
      await Tone.start();
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="spectrogram">
      <h4>🎛 Spectrogram Visualization</h4>
      <canvas ref={canvasRef} width={800} height={300} />
      <div className="controls">
        <button onClick={togglePlayback}>{isPlaying ? '⏹ Stop' : '▶️ Play'}</button>
        <label>
          FFT Size:
          <input
            type="range"
            min="256"
            max="4096"
            step="256"
            value={fftSize}
            onChange={(e) => setFftSize(Number(e.target.value))}
          />
        </label>
        <label>
          Smoothing:
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={smoothing}
            onChange={(e) => setSmoothing(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

export default Spectrogram;

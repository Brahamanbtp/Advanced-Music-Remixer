import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAudio } from '../contexts/AudioContext';

const Visualizer = ({ audioBuffer }) => {
  const canvasRef = useRef(null);
  const { startAudioContext } = useAudio();
  const [analyser, setAnalyser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [mode, setMode] = useState('waveform'); // 'waveform', 'spectrum', 'bars'
  const animationRef = useRef(null);

  useEffect(() => {
    startAudioContext(); // Ensure AudioContext starts
  }, [startAudioContext]);

  useEffect(() => {
    if (!audioBuffer) return;

    const audioCtx = new AudioContext();
    const newAnalyser = audioCtx.createAnalyser();
    newAnalyser.fftSize = 2048;
    const bufferSource = audioCtx.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(newAnalyser);
    bufferSource.start();
    setAnalyser(newAnalyser);
    setIsReady(true);

    return () => {
      bufferSource.disconnect();
      newAnalyser.disconnect();
    };
  }, [audioBuffer]);

  const drawVisualizer = useCallback(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);

      if (mode === 'waveform') {
        analyser.getByteTimeDomainData(dataArray);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00FFCC';
        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      } else if (mode === 'spectrum') {
        analyser.getByteFrequencyData(dataArray);
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(0, 255, 200, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 50, 150, 0.4)');
        ctx.fillStyle = gradient;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i] * 1.5;
          ctx.fillRect(i * 3, height - barHeight, 2, barHeight);
        }
      } else if (mode === 'bars') {
        analyser.getByteFrequencyData(dataArray);
        const barWidth = width / bufferLength;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i] * 1.5;
          const r = Math.min(255, dataArray[i] * 2);
          const g = 255 - r;
          const b = 150;
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
        }
      }

      animationRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();
  }, [analyser, mode]);

  useEffect(() => {
    if (!isReady) return;
    drawVisualizer();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isReady, drawVisualizer]);

  return (
    <div className="visualizer-container">
      <h4>🎵 Audio Visualizer</h4>
      {!isReady ? (
        <p>Loading waveform... Please load an audio track.</p>
      ) : (
        <>
          <canvas ref={canvasRef} width={800} height={300} />
          <div className="visualizer-controls">
            <button onClick={() => setMode('waveform')}>Waveform</button>
            <button onClick={() => setMode('spectrum')}>Spectrum</button>
            <button onClick={() => setMode('bars')}>Bars</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Visualizer;

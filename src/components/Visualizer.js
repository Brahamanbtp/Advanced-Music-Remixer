import React, { useRef, useEffect, useState } from 'react';
import { useAudio } from '../contexts/AudioContext';

const Visualizer = ({ audioBuffer }) => {
  const canvasRef = useRef(null);
  const { startAudioContext } = useAudio();
  const [buffer, setBuffer] = useState(null);

  useEffect(() => {
    startAudioContext(); // Ensure the audio context starts

    console.log('Visualizer.js: Received audioBuffer:', audioBuffer);

    if (!audioBuffer) {
      console.warn('Visualizer.js: Audio buffer is not provided. Waiting for data...');
      return;
    }

    if (!(audioBuffer instanceof AudioBuffer)) {
      console.error('Visualizer.js: Invalid audioBuffer detected.', audioBuffer);
      return;
    }

    setBuffer(audioBuffer);
  }, [audioBuffer, startAudioContext]);

  useEffect(() => {
    if (!buffer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const data = buffer.getChannelData(0);
    const bufferLength = data.length;

    const drawWaveform = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(0, 0, 0)';
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = data[i] * height / 2;
        const y = height / 2 - v;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();
    };

    drawWaveform();

    return () => ctx.clearRect(0, 0, width, height);
  }, [buffer]);

  return (
    <div className="visualizer">
      <h4>Audio Visualizer</h4>
      {!buffer ? (
        <p>Loading audio... Ensure an audio track is loaded.</p>
      ) : (
        <canvas ref={canvasRef} width={800} height={300} />
      )}
    </div>
  );
};

export default Visualizer;

import React, { useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { useAudio } from '../contexts/AudioContext'; // Correct path to AudioContext

const Visualizer = ({ audioBuffer }) => {
  const canvasRef = useRef(null);
  const { startAudioContext } = useAudio();

  useEffect(() => {
    // Ensure AudioContext is started
    startAudioContext();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    if (!audioBuffer) {
      console.error('Audio buffer is not provided.');
      return;
    }

    const data = audioBuffer.getChannelData(0);
    const bufferLength = data.length;

    const drawWaveform = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(0, 0, 0)';
      ctx.beginPath();

      const sliceWidth = width * 1.0 / bufferLength;
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

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    const drawSpectrogram = () => {
      ctx.clearRect(0, 0, width, height);
      const analyser = Tone.context.createAnalyser();
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        analyser.getByteTimeDomainData(dataArray);
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.beginPath();

        let sliceWidth = width * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          let v = dataArray[i] / 128.0;
          let y = v * height / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        requestAnimationFrame(draw);
      };

      draw();
    };

    drawWaveform();
    drawSpectrogram();
  }, [audioBuffer, startAudioContext]);

  return (
    <div className="visualizer">
      <h4>Audio Visualizer</h4>
      <canvas ref={canvasRef} width={500} height={200} />
    </div>
  );
};

export default Visualizer;

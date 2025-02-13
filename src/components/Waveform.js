import React, { useRef, useEffect } from 'react';

const Waveform = ({ audioBuffer }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const data = audioBuffer.getChannelData(0); // Get the audio data from the first channel
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

    drawWaveform();
  }, [audioBuffer]);

  return (
    <div className="waveform">
      <h4>Waveform Visualization</h4>
      <canvas ref={canvasRef} width={500} height={200} />
    </div>
  );
};

export default Waveform;

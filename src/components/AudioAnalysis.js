import React, { useRef, useEffect, useState } from 'react';
import * as Tone from 'tone';

const AudioAnalysis = ({ audioBuffer }) => {
  const canvasRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
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

      if (isAnalyzing) {
        requestAnimationFrame(draw);
      }
    };

    if (audioBuffer) {
      const source = Tone.context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyser);
      analyser.connect(Tone.context.destination);
      source.start();
      setIsAnalyzing(true);
      draw();
    }

    return () => {
      setIsAnalyzing(false);
    };
  }, [audioBuffer, isAnalyzing]);

  return (
    <div className="audio-analysis">
      <h4>Audio Analysis</h4>
      <canvas ref={canvasRef} width={500} height={200} />
      <button onClick={() => setIsAnalyzing(!isAnalyzing)}>
        {isAnalyzing ? 'Stop Analysis' : 'Start Analysis'}
      </button>
    </div>
  );
};

export default AudioAnalysis;

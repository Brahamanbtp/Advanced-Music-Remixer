import React, { useRef, useEffect, useState } from 'react';
import * as Tone from 'tone';

const AudioAnalysis = ({ audioBuffer }) => {
  const canvasRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!audioBuffer) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Create an AnalyserNode
    const analyser = Tone.context.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Create & connect source
    const source = Tone.context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);
    analyser.connect(Tone.context.destination);
    sourceRef.current = source;

    const draw = () => {
      if (!isAnalyzing) return;
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);
      
      // Draw waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#4CAF50';
      ctx.beginPath();

      let sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 255;
        let y = v * height;

        if (i === 0) {
          ctx.moveTo(x, height - y);
        } else {
          ctx.lineTo(x, height - y);
        }

        x += sliceWidth;
      }

      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    return () => {
      cancelAnimationFrame(animationRef.current);
      setIsAnalyzing(false);
      analyser.disconnect();
      source.disconnect();
    };
  }, [audioBuffer, isAnalyzing]);

  const handleStartAnalysis = async () => {
    if (!audioBuffer) return;
    await Tone.start();
    
    setIsAnalyzing(true);
    setIsPlaying(true);
    sourceRef.current.start();
    
    animationRef.current = requestAnimationFrame(() => {
      if (analyserRef.current) analyserRef.current.getByteTimeDomainData(new Uint8Array(analyserRef.current.frequencyBinCount));
    });
  };

  const handleStopAnalysis = () => {
    setIsAnalyzing(false);
    setIsPlaying(false);
    sourceRef.current.stop();
    cancelAnimationFrame(animationRef.current);
  };

  return (
    <div className="audio-analysis">
      <h4>🎵 Audio Analysis</h4>
      <canvas ref={canvasRef} width={600} height={250} />
      <div>
        <button onClick={isPlaying ? handleStopAnalysis : handleStartAnalysis}>
          {isPlaying ? '⏹ Stop Analysis' : '▶ Start Analysis'}
        </button>
      </div>
    </div>
  );
};

export default AudioAnalysis;

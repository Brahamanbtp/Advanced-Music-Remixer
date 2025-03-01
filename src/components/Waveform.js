import React, { useRef, useEffect, useState } from "react";

const Waveform = ({ audioBuffer }) => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth * 0.8, height: 300 });
  const animationRef = useRef(null);

  useEffect(() => {
    if (!audioBuffer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up responsive resizing
    const handleResize = () => {
      setDimensions({ width: window.innerWidth * 0.8, height: 300 });
    };
    window.addEventListener("resize", handleResize);

    // Extract multi-channel audio data
    const channels = Array.from({ length: audioBuffer.numberOfChannels }, (_, i) =>
      audioBuffer.getChannelData(i)
    );
    const bufferLength = channels[0].length;

    const drawWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#00ffcc"; // Neon Cyan for high contrast
      ctx.fillStyle = "rgba(0, 255, 204, 0.2)"; // Soft filled effect
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const y = canvas.height / 2 - channels[0][i] * canvas.height * 0.4;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.stroke();
      ctx.fill();
      animationRef.current = requestAnimationFrame(drawWaveform);
    };

    // Start animation loop
    animationRef.current = requestAnimationFrame(drawWaveform);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [audioBuffer, dimensions]);

  return (
    <div style={{ textAlign: "center", padding: "10px", background: "#111", borderRadius: "8px" }}>
      <h4 style={{ color: "#00ffcc", fontFamily: "Arial, sans-serif" }}>Waveform Visualization</h4>
      <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default Waveform;

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAudio } from '../contexts/AudioContext';
import * as Tone from 'tone';

const Automation = ({ parameter }) => {
  const { automation, addAutomationPoint } = useAudio();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawAutomation = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const filteredPoints = automation.filter((point) => point.parameter === parameter);

      if (filteredPoints.length === 0) return;

      ctx.beginPath();
      ctx.strokeStyle = '#00BFFF'; // Light Blue for better visibility
      ctx.lineWidth = 2;

      filteredPoints.forEach((point, index) => {
        const x = (point.time / Tone.Transport.seconds) * width;
        const y = height - point.value * height;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    };

    const animate = () => {
      drawAutomation();
      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [automation, parameter, isAnimating]);

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = canvas.width;
    const height = canvas.height;

    const time = (x / width) * Tone.Transport.seconds;
    const value = 1 - y / height; // Invert y-axis for proper scaling

    addAutomationPoint(parameter, time, value);
  }, [addAutomationPoint, parameter]);

  return (
    <div className="automation">
      <h4>🎛 Automation: {parameter}</h4>
      <canvas
        ref={canvasRef}
        width={600}
        height={120}
        onClick={handleCanvasClick} // Click to add automation points
        style={{ border: '1px solid #ccc', cursor: 'pointer' }}
      />
      <div>
        <button onClick={() => setIsAnimating(!isAnimating)}>
          {isAnimating ? '⏸ Pause' : '▶ Resume'}
        </button>
      </div>
    </div>
  );
};

export default Automation;

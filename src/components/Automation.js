import React, { useRef, useEffect, useState } from 'react';
import { useAudio } from '../contexts/AudioContext';
import * as Tone from 'tone';

const Automation = ({ parameter }) => {
  const { automation, addAutomationPoint } = useAudio();
  const canvasRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const drawAutomation = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();

      const filteredPoints = automation.filter(point => point.parameter === parameter);

      filteredPoints.forEach((point, index) => {
        const x = (point.time / Tone.Transport.seconds) * width;
        const y = height - (point.value * height);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const animate = () => {
      drawAutomation();
      if (isAnimating) {
        requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      setIsAnimating(false);
    };
  }, [automation, parameter, isAnimating]);

  const handleAddAutomationPoint = () => {
    const time = Tone.now();
    const value = Math.random(); // Replace with actual value input
    addAutomationPoint(parameter, time, value);
  };

  return (
    <div className="automation">
      <h4>Automation for {parameter}</h4>
      <canvas ref={canvasRef} width={500} height={100} />
      <button onClick={handleAddAutomationPoint}>Add Automation Point</button>
      <button onClick={() => setIsAnimating(!isAnimating)}>
        {isAnimating ? 'Pause Animation' : 'Resume Animation'}
      </button>
    </div>
  );
};

export default Automation;

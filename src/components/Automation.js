import React, { useRef, useEffect, useState, useCallback } from "react";
import { useAudio } from "../contexts/AudioContext";
import * as Tone from "tone";

const Automation = ({ parameter }) => {
  const { automation, addAutomationPoint } = useAudio();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const drawAutomation = () => {
      if (!automation || automation.size === 0) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // ✅ Convert `Map` to an array before filtering
      const automationArray = Array.from(automation.values());
      const filteredPoints = automationArray.filter(
        (point) => point.parameter === parameter
      );

      if (filteredPoints.length === 0) return;

      // ✅ Enhanced Styling
      ctx.beginPath();
      ctx.strokeStyle = "#00BFFF"; // Light Blue for visibility
      ctx.lineWidth = 2;

      filteredPoints.forEach((point, index) => {
        const x = (point.time / Tone.Transport.seconds) * width;
        const y = height - point.value * height; // Scale value

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

    return () => cancelAnimationFrame(animationRef.current);
  }, [automation, parameter, isAnimating]);

  // ✅ Add Automation Point on Click
  const handleCanvasClick = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = canvas.width;
      const height = canvas.height;

      const time = (x / width) * Tone.Transport.seconds;
      const value = 1 - y / height; // Invert Y-axis for scaling

      addAutomationPoint(parameter, time, value);
    },
    [addAutomationPoint, parameter]
  );

  return (
    <div className="automation">
      <h4>🎛 Automation: {parameter}</h4>
      <canvas
        ref={canvasRef}
        width={600}
        height={120}
        onClick={handleCanvasClick} // ✅ Click to add automation points
        style={{
          border: "2px solid #555",
          cursor: "pointer",
          borderRadius: "8px",
          background: "#222",
        }}
      />
      <div>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            background: isAnimating ? "#d9534f" : "#5cb85c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isAnimating ? "⏸ Pause" : "▶ Resume"}
        </button>
      </div>
    </div>
  );
};

export default Automation;

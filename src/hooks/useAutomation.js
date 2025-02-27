import { useState, useEffect, useCallback } from 'react';

const useAutomation = (parameter) => {
  const [automationPoints, setAutomationPoints] = useState([]);

  // Function to add an automation point
  const addAutomationPoint = useCallback((time, value) => {
    setAutomationPoints((prevPoints) => [
      ...prevPoints,
      { time, value },
    ]);
  }, []);

  // Function to update an automation point
  const updateAutomationPoint = useCallback((index, newTime, newValue) => {
    setAutomationPoints((prevPoints) =>
      prevPoints.map((point, i) =>
        i === index ? { time: newTime, value: newValue } : point
      )
    );
  }, []);

  // Function to remove an automation point
  const removeAutomationPoint = useCallback((index) => {
    setAutomationPoints((prevPoints) =>
      prevPoints.filter((_, i) => i !== index)
    );
  }, []);

  useEffect(() => {
    // Apply automation points to the parameter
    automationPoints.forEach((point) => {
      // Logic to apply automation to the parameter
      console.log(`Applying automation to ${parameter} at time ${point.time} with value ${point.value}`);
      // Example: parameter.setValueAtTime(point.value, point.time);
    });
  }, [automationPoints, parameter]);

  return {
    automationPoints,
    addAutomationPoint,
    updateAutomationPoint,
    removeAutomationPoint,
  };
};

export default useAutomation;

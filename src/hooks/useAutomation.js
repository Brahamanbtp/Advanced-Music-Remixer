import { useReducer, useEffect, useCallback } from "react";
import * as Tone from "tone";

// 🎛 Load initial automation points from localStorage
const loadInitialAutomation = (parameter) => {
  try {
    const savedAutomation = localStorage.getItem(`automation_${parameter}`);
    return savedAutomation ? JSON.parse(savedAutomation) : [];
  } catch (error) {
    console.error("❌ Error loading automation points:", error);
    return [];
  }
};

// 🎚 Reducer for managing automation points
const automationReducer = (state, action) => {
  switch (action.type) {
    case "ADD_POINT":
      return [...state, { time: action.time, value: action.value }];
      
    case "UPDATE_POINT":
      return state.map((point, i) =>
        i === action.index ? { time: action.time, value: action.value } : point
      );

    case "REMOVE_POINT":
      return state.filter((_, i) => i !== action.index);

    case "SET_AUTOMATION":
      return action.payload;

    default:
      console.warn("⚠️ Unknown action type:", action.type);
      return state;
  }
};

// 🎛 useAutomation Hook
const useAutomation = (parameter) => {
  const [automationPoints, dispatch] = useReducer(
    automationReducer,
    parameter,
    loadInitialAutomation
  );

  // 🎚 Add an automation point
  const addAutomationPoint = useCallback((time, value) => {
    dispatch({ type: "ADD_POINT", time, value });
  }, []);

  // 🎛 Update an existing automation point
  const updateAutomationPoint = useCallback((index, newTime, newValue) => {
    dispatch({ type: "UPDATE_POINT", index, time: newTime, value: newValue });
  }, []);

  // 🎚 Remove an automation point
  const removeAutomationPoint = useCallback((index) => {
    dispatch({ type: "REMOVE_POINT", index });
  }, []);

  // 🎵 Apply automation to the Tone.js parameter
  useEffect(() => {
    if (!parameter) return;

    automationPoints.forEach((point) => {
      console.log(`🔹 Automating ${parameter} at time ${point.time} with value ${point.value}`);
      if (parameter.setValueAtTime) {
        parameter.setValueAtTime(point.value, point.time);
      }
    });
  }, [automationPoints, parameter]);

  // 🎼 Persist automation points to localStorage
  useEffect(() => {
    localStorage.setItem(`automation_${parameter}`, JSON.stringify(automationPoints));
  }, [automationPoints, parameter]);

  return {
    automationPoints,
    addAutomationPoint,
    updateAutomationPoint,
    removeAutomationPoint,
  };
};

export default useAutomation;

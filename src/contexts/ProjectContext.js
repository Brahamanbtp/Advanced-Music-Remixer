import React, { createContext, useReducer, useContext, useEffect } from "react";
import { produce } from "immer"; // ✅ Immutable state management

// Create a context for managing project-related state
export const ProjectContext = createContext();

// Initial project state, loaded from localStorage if available
const loadInitialProject = () => {
  try {
    const savedProject = localStorage.getItem("musicProject");
    return savedProject ? JSON.parse(savedProject) : {};
  } catch (error) {
    console.error("❌ Error loading project from local storage:", error);
    return {};
  }
};

// Reducer function for managing project state updates
const projectReducer = (state, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "SAVE_PROJECT":
        return action.payload;
      case "UPDATE_PROJECT":
        Object.assign(draft, action.payload);
        break;
      default:
        console.warn("⚠️ Unknown action type:", action.type);
    }
  });
};

// ProjectProvider component
export const ProjectProvider = ({ children }) => {
  const [project, dispatch] = useReducer(projectReducer, {}, loadInitialProject);

  // Function to save project state
  const saveProject = (data) => {
    dispatch({ type: "SAVE_PROJECT", payload: data });
    persistToLocalStorage(data);
  };

  // Function to update the project state
  const updateProject = (updatedData) => {
    dispatch({ type: "UPDATE_PROJECT", payload: updatedData });
    persistToLocalStorage({ ...project, ...updatedData });
  };

  // Efficient local storage update with requestIdleCallback
  const persistToLocalStorage = (data) => {
    try {
      if (window.requestIdleCallback) {
        requestIdleCallback(() => localStorage.setItem("musicProject", JSON.stringify(data)));
      } else {
        setTimeout(() => localStorage.setItem("musicProject", JSON.stringify(data)), 200);
      }
    } catch (error) {
      console.error("❌ Error saving project to local storage:", error);
    }
  };

  // Load project from local storage on mount
  useEffect(() => {
    dispatch({ type: "SAVE_PROJECT", payload: loadInitialProject() });
  }, []);

  return (
    <ProjectContext.Provider value={{ project, saveProject, updateProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the ProjectContext
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for managing project-related state
export const ProjectContext = createContext();

// Create a provider component to manage project state
export const ProjectProvider = ({ children }) => {
  const [project, setProject] = useState(() => {
    // Initialize state from local storage if available
    const savedProject = localStorage.getItem('musicProject');
    return savedProject ? JSON.parse(savedProject) : {};
  });

  // Function to save the current project state
  const saveProject = (data) => {
    setProject(data);
    try {
      localStorage.setItem('musicProject', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving project to local storage:', error);
    }
  };

  // Function to load a project from local storage
  const loadProject = () => {
    const savedProject = localStorage.getItem('musicProject');
    if (savedProject) {
      setProject(JSON.parse(savedProject));
    }
  };

  // Function to update the project state
  const updateProject = (updatedData) => {
    const newProject = { ...project, ...updatedData };
    setProject(newProject);
    try {
      localStorage.setItem('musicProject', JSON.stringify(newProject));
    } catch (error) {
      console.error('Error updating project in local storage:', error);
    }
  };

  // Load project from local storage on mount
  useEffect(() => {
    loadProject();
  }, []);

  return (
    <ProjectContext.Provider value={{ project, saveProject, loadProject, updateProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the ProjectContext
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

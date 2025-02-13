import React, { createContext, useState, useContext } from 'react';

// Create a context for managing project-related state
export const ProjectContext = createContext();

// Create a provider component to manage project state
export const ProjectProvider = ({ children }) => {
  const [project, setProject] = useState({});

  // Function to save the current project state
  const saveProject = (data) => {
    setProject(data);
    // Save to local storage or backend
    localStorage.setItem('musicProject', JSON.stringify(data));
  };

  // Function to load a project from local storage or backend
  const loadProject = () => {
    const savedProject = localStorage.getItem('musicProject');
    if (savedProject) {
      setProject(JSON.parse(savedProject));
    }
  };

  // Function to update the project state
  const updateProject = (updatedData) => {
    setProject((prevProject) => ({
      ...prevProject,
      ...updatedData,
    }));
    // Optionally, save the updated project to local storage or backend
    localStorage.setItem('musicProject', JSON.stringify({ ...project, ...updatedData }));
  };

  return (
    <ProjectContext.Provider value={{ project, saveProject, loadProject, updateProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the ProjectContext
export const useProject = () => {
  return useContext(ProjectContext);
};

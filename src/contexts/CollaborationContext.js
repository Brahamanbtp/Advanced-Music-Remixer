import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';

// Create a context for managing collaboration-related state
export const CollaborationContext = createContext();

// Create a provider component to manage collaboration state
export const CollaborationProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [projectData, setProjectData] = useState({});
  const socket = io('http://localhost:4000'); // Connect to the Socket.IO server

  useEffect(() => {
    // Listen for updates from the server
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('users', (data) => {
      setUsers(data);
    });

    socket.on('projectData', (data) => {
      setProjectData(data);
    });

    // Clean up the effect
    return () => {
      socket.off('connect');
      socket.off('users');
      socket.off('projectData');
    };
  }, [socket]);

  // Function to update the project data on the server
  const updateProject = (data) => {
    socket.emit('updateProject', data);
  };

  return (
    <CollaborationContext.Provider value={{ users, projectData, updateProject }}>
      {children}
    </CollaborationContext.Provider>
  );
};

// Custom hook to use the CollaborationContext
export const useCollaboration = () => {
  return useContext(CollaborationContext);
};

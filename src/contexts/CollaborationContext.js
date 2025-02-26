import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';

// Create a context for managing collaboration-related state
export const CollaborationContext = createContext();

// Create a provider component to manage collaboration state
export const CollaborationProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [projectData, setProjectData] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize the socket connection
    socketRef.current = io('http://localhost:4000', {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    // Listen for updates from the server
    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socketRef.current.on('users', (data) => {
      setUsers(data);
    });

    socketRef.current.on('projectData', (data) => {
      setProjectData(data);
    });

    // Clean up the effect
    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('users');
        socketRef.current.off('projectData');
        socketRef.current.close();
      }
    };
  }, []);

  // Function to update the project data on the server
  const updateProject = (data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('updateProject', data);
    } else {
      console.error('Socket is not connected. Cannot update project.');
    }
  };

  return (
    <CollaborationContext.Provider value={{ users, projectData, updateProject, isConnected }}>
      {children}
    </CollaborationContext.Provider>
  );
};

// Custom hook to use the CollaborationContext
export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};

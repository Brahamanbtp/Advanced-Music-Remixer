import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import io from "socket.io-client";
import { produce } from "immer"; // ✅ Immutable state management

// Create a context for managing collaboration-related state
export const CollaborationContext = createContext();

// Server URL (Modify if deployed)
const SERVER_URL = "http://localhost:4000";

export const CollaborationProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [projectData, setProjectData] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);

  useEffect(() => {
    const connectSocket = () => {
      socketRef.current = io(SERVER_URL, {
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: Math.min(1000 * 2 ** reconnectAttempts.current, 30000), // Exponential backoff
        transports: ["websocket"], // Force WebSocket for low latency
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Connected to server");
        setIsConnected(true);
        reconnectAttempts.current = 0; // Reset reconnect attempts
      });

      socketRef.current.on("disconnect", () => {
        console.warn("⚠️ Disconnected from server");
        setIsConnected(false);
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("❌ Connection error:", err.message);
      });

      socketRef.current.on("users", (data) => {
        setUsers(
          produce((draft) => {
            return data;
          })
        );
      });

      socketRef.current.on("projectData", (data) => {
        setProjectData(
          produce((draft) => {
            return { ...draft, ...data };
          })
        );
      });
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("users");
        socketRef.current.off("projectData");
        socketRef.current.close();
      }
    };
  }, []);

  // ✅ Function to update project data in real-time
  const updateProject = (data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("updateProject", data);
    } else {
      console.error("⚠️ Cannot update project, socket not connected.");
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
    throw new Error("useCollaboration must be used within a CollaborationProvider");
  }
  return context;
};

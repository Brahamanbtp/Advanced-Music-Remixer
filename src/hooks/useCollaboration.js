import { useState, useEffect, useContext, useCallback, useReducer, useRef } from "react";
import { CollaborationContext } from "../contexts/CollaborationContext";

// 🎚 Reducer for managing local project state
const projectReducer = (state, action) => {
  switch (action.type) {
    case "SET_PROJECT":
      return action.payload;
    case "UPDATE_PROJECT":
      return { ...state, ...action.payload };
    default:
      console.warn("⚠️ Unknown action type:", action.type);
      return state;
  }
};

// 🎛 Custom Hook for Collaboration
const useCollaboration = () => {
  const { users, projectData, updateProject } = useContext(CollaborationContext);
  const [isSyncing, setIsSyncing] = useState(false);
  const [localProjectData, dispatch] = useReducer(projectReducer, projectData);

  // 🔄 Sync local state with global projectData
  useEffect(() => {
    dispatch({ type: "SET_PROJECT", payload: projectData });
  }, [projectData]);

  // ⏳ Debounced sync function using useRef
  const debounceRef = useRef(null);

  const syncProject = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    
    try {
      console.log("🔄 Syncing project with server...");
      await updateProject(localProjectData);
      console.log("✅ Project synced successfully!");
    } catch (error) {
      console.error("❌ Error syncing project:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [localProjectData, updateProject, isSyncing]);

  // 🔹 Debounce function to limit sync rate
  const debouncedSync = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(syncProject, 500);
  }, [syncProject]);

  // 🔄 Automatically sync on project changes
  useEffect(() => {
    debouncedSync();
    return () => clearTimeout(debounceRef.current);
  }, [localProjectData, debouncedSync]);

  return {
    users,
    localProjectData,
    setLocalProjectData: (data) => dispatch({ type: "UPDATE_PROJECT", payload: data }),
    syncProject,
    isSyncing,
  };
};

export default useCollaboration;

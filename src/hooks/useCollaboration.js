import { useState, useEffect, useContext, useCallback } from 'react';
import { CollaborationContext } from '../contexts/CollaborationContext';

const useCollaboration = () => {
  const { users, projectData, updateProject, syncProjectWithServer } = useContext(CollaborationContext);
  const [localProjectData, setLocalProjectData] = useState(projectData);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Sync local changes with the project data from the server
    setLocalProjectData(projectData);
  }, [projectData]);

  const syncProject = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await updateProject(localProjectData);
      console.log('Project synced successfully');
    } catch (error) {
      console.error('Error syncing project:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [localProjectData, updateProject, isSyncing]);

  const debouncedSync = useCallback(
    debounce(() => {
      syncProject();
    }, 500),
    [syncProject]
  );

  useEffect(() => {
    // Sync project with server on component unmount or when localProjectData change
    debouncedSync();
    return () => {
      debouncedSync.cancel();
    };
  }, [localProjectData, debouncedSync]);

  return {
    users,
    localProjectData,
    setLocalProjectData,
    syncProject,
    isSyncing,
  };
};

// Debounce function to limit the rate at which syncProject is called
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export default useCollaboration;

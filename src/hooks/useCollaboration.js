import { useState, useEffect, useContext } from 'react';
import { CollaborationContext } from '../contexts/CollaborationContext';

const useCollaboration = () => {
  const { users, projectData, updateProject } = useContext(CollaborationContext);
  const [localProjectData, setLocalProjectData] = useState(projectData);

  useEffect(() => {
    // Sync local changes with the project data from the server
    setLocalProjectData(projectData);
  }, [projectData]);

  const syncProject = () => {
    updateProject(localProjectData);
  };

  return {
    users,
    localProjectData,
    setLocalProjectData,
    syncProject,
  };
};

export default useCollaboration;

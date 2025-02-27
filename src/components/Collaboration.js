import React, { useContext, useEffect, useState, useCallback } from 'react';
import { CollaborationContext } from '../contexts/CollaborationContext';
import debounce from 'lodash.debounce';

const Collaboration = () => {
  const { users, projectData, updateProject } = useContext(CollaborationContext);
  const [localChanges, setLocalChanges] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Sync local changes with the project data from the server
    setLocalChanges(projectData);
  }, [projectData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalChanges((prevChanges) => ({
      ...prevChanges,
      [name]: value,
    }));
  };

  const syncProjectWithServer = useCallback(
    async (changes) => {
      if (isSyncing) return;
      setIsSyncing(true);
      try {
        await updateProject(changes);
        console.log('Project synced successfully');
      } catch (error) {
        console.error('Error syncing project:', error);
      } finally {
        setIsSyncing(false);
      }
    },
    [isSyncing, updateProject]
  );

  useEffect(() => {
    // Debounce function created inside useEffect to prevent re-creating on every render
    const debouncedSync = debounce((changes) => {
      syncProjectWithServer(changes);
    }, 500);

    debouncedSync(localChanges);

    return () => {
      debouncedSync.cancel();
    };
  }, [localChanges, syncProjectWithServer]);

  return (
    <div className="collaboration">
      <h3>Real-Time Collaboration</h3>
      <div>
        <h4>Users</h4>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Project Data</h4>
        {Object.keys(projectData).map((key) => (
          <div key={key}>
            <label>
              {key}
              <input
                type="text"
                name={key}
                value={localChanges[key] || ''}
                onChange={handleInputChange}
              />
            </label>
          </div>
        ))}
      </div>
      <button onClick={() => syncProjectWithServer(localChanges)} disabled={isSyncing}>
        {isSyncing ? 'Syncing...' : 'Sync Project'}
      </button>
    </div>
  );
};

export default Collaboration;

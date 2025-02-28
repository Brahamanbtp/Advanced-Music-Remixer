import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { CollaborationContext } from '../contexts/CollaborationContext';
import debounce from 'lodash.debounce';

const Collaboration = () => {
  const { users, projectData, updateProject, isConnected, reconnectSocket } = useContext(CollaborationContext);
  const [localChanges, setLocalChanges] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    setLocalChanges(projectData);
  }, [projectData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalChanges((prev) => ({ ...prev, [name]: value }));
  };

  const syncProjectWithServer = useCallback(async (changes) => {
    if (!isConnected) {
      console.warn('🚨 Socket is not connected. Skipping update.');
      return;
    }

    setIsSyncing(true);
    try {
      await updateProject(changes);
      setLastSyncTime(new Date().toLocaleTimeString());
      console.log('✅ Project synced successfully');
    } catch (error) {
      console.error('❌ Error syncing project:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isConnected, updateProject]);

  const debouncedSync = useMemo(() => debounce(syncProjectWithServer, 500), [syncProjectWithServer]);

  useEffect(() => {
    debouncedSync(localChanges);
    return () => debouncedSync.cancel();
  }, [localChanges, debouncedSync]);

  return (
    <div className="collaboration">
      <h3>🔗 Real-Time Collaboration</h3>

      <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}  
      </div>

      {!isConnected && reconnectSocket && (
        <button onClick={reconnectSocket} className="retry-button">Reconnect</button>
      )}

      <div>
        <h4>👥 Active Users</h4>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4>📂 Project Data</h4>
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

      <button onClick={() => syncProjectWithServer(localChanges)} disabled={isSyncing || !isConnected}>
        {isSyncing ? '⏳ Syncing...' : '🔄 Sync Project'}
      </button>

      {lastSyncTime && <p className="sync-time">Last Synced: {lastSyncTime}</p>}
    </div>
  );
};

export default Collaboration;

import React, { useContext, useEffect, useState } from 'react';
import { CollaborationContext } from '../contexts/CollaborationContext';

const Collaboration = () => {
  const { users, projectData, updateProject } = useContext(CollaborationContext);
  const [localChanges, setLocalChanges] = useState({});

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

  const syncProjectWithServer = () => {
    updateProject(localChanges);
  };

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
      <button onClick={syncProjectWithServer}>Sync Project</button>
    </div>
  );
};

export default Collaboration;

import React, { useState } from 'react';

const Customization = ({ onCustomize }) => {
  const [theme, setTheme] = useState('light');
  const [layout, setLayout] = useState('default');

  const handleCustomize = () => {
    onCustomize({ theme, layout });
  };

  return (
    <div className="customization">
      <h3>UI Customization</h3>
      <label>
        Theme
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <label>
        Layout
        <select value={layout} onChange={(e) => setLayout(e.target.value)}>
          <option value="default">Default</option>
          <option value="compact">Compact</option>
        </select>
      </label>
      <button onClick={handleCustomize}>Apply Customization</button>
    </div>
  );
};

export default Customization;

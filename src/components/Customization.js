import React, { useState, useEffect } from 'react';

const Customization = ({ onCustomize }) => {
  const [theme, setTheme] = useState(() => {
    // Load theme from local storage or default to 'light'
    return localStorage.getItem('theme') || 'light';
  });

  const [layout, setLayout] = useState(() => {
    // Load layout from local storage or default to 'default'
    return localStorage.getItem('layout') || 'default';
  });

  useEffect(() => {
    // Save theme and layout to local storage whenever they change
    localStorage.setItem('theme', theme);
    localStorage.setItem('layout', layout);
  }, [theme, layout]);

  const handleCustomize = () => {
    onCustomize({ theme, layout });
  };

  return (
    <div className="customization">
      <h3>UI Customization</h3>
      <label>
        Theme
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          aria-label="Select Theme"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="high-contrast">High Contrast</option>
        </select>
      </label>
      <label>
        Layout
        <select
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          aria-label="Select Layout"
        >
          <option value="default">Default</option>
          <option value="compact">Compact</option>
          <option value="wide">Wide</option>
        </select>
      </label>
      <button onClick={handleCustomize} aria-label="Apply Customization">
        Apply Customization
      </button>
    </div>
  );
};

export default Customization;

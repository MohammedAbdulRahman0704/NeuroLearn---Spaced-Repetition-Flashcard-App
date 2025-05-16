import React, { useState, useEffect } from 'react';

const SettingsPage: React.FC = () => {
  // State for toggles
  const [darkMode, setDarkMode] = useState(() => {
    // Load initial mode from localStorage or default to false
    return localStorage.getItem('darkMode') === 'true';
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Update dark mode class on body and save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Dark Mode</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Toggle light/dark theme.</p>
          </div>
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 peer-checked:bg-indigo-600"></div>
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5`}
            />
          </label>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Enable or disable notifications.</p>
          </div>
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 peer-checked:bg-indigo-600"></div>
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5`}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

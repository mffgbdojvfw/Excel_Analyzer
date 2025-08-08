



import React, { useContext, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { ThemeContext } from '../context/ThemeContext';

const Settings = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    alert('Settings saved');
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-2">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="border px-4 py-2 rounded w-60"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Notifications</label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                Enable Email Notifications
              </span>
            </label>
          </div>

          <div>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

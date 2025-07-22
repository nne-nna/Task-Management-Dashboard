import React from 'react';
import { useThemeContext } from '../context/ThemeContext';

const SettingsPage: React.FC = () => {
  const { isDark } = useThemeContext();

  return (
    <div
      className={`flex-1 p-8 min-h-screen ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div className="max-w-full mx-auto">
        <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h2>

        <div
          className={`rounded-xl p-6 shadow-sm border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } mb-6`}
        >
          <h3
            className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            General Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="notification-toggle"
                className="flex items-center justify-between cursor-pointer"
              >
                <span
                  className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Enable Notifications
                </span>
                <input type="checkbox" id="notification-toggle" className="sr-only peer" />
                <div
                  className={`relative w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-checked:bg-blue-600 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 peer-focus:ring-blue-800'
                      : 'bg-gray-200 border-gray-300 peer-focus:ring-blue-300'
                  }`}
                ></div>
              </label>
            </div>
            <div>
              <label
                htmlFor="language-select"
                className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                } mb-1`}
              >
                Language
              </label>
              <select
                id="language-select"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl p-6 shadow-sm border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h3
            className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Account Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email-input"
                className={`block text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                } mb-1`}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email-input"
                defaultValue="user@example.com"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
                }`}
                readOnly
              />
            </div>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                isDark ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
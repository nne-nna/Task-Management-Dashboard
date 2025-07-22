import React from "react";
import { Link } from "react-router-dom";
import { Menu, Sun, Moon } from "lucide-react";
import { useThemeContext } from "../context/ThemeContext";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <nav
      className={`shadow-sm border-b p-4 sticky top-0 z-30 ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="max-w-full mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className={`lg:hidden mr-4 ${
              isDark
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <Link
            to="/dashboard"
            className={`text-xl font-bold hidden lg:block ${
              isDark
                ? "text-white hover:text-blue-400"
                : "text-gray-900 hover:text-blue-600"
            } transition-colors duration-200`}
          >
            Task Management
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDark
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            title={isDark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

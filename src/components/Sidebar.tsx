import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  Settings,
  HelpCircle,
  X,
  BookOpenCheck,
  LayoutDashboard,
} from "lucide-react";
import { useThemeContext } from "../context/ThemeContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isDark } = useThemeContext();
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      pathMatch: "/dashboard",
    },
    {
      name: "Calendar",
      icon: Calendar,
      path: "/calendar",
      pathMatch: "/calendar",
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 ${
            isDark ? "bg-gray-900/50" : "bg-gray-100/50"
          } z-40 lg:hidden transition-opacity duration-300`}
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 ${
          isDark
            ? "bg-gray-800 border-r-gray-600"
            : "bg-white border-r-gray-200"
        } shadow-lg border-r z-50 flex flex-col
            transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:shadow-none lg:border-r
            transition-transform duration-300 ease-in-out`}
      >
        <div
          className={`flex-shrink-0 pt-4 px-4 pb-2 flex justify-between items-center ${
            isDark ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpenCheck
              className={`text-xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            />
            <Link to="/dashboard">
              <h2
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                TaskFlow
              </h2>
            </Link>
          </div>
          <button
            onClick={onClose}
            className={`lg:hidden p-1 rounded-lg transition-colors duration-200 ${
              isDark
                ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 min-h-0 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center w-full px-4 py-2 rounded-lg text-left transition-colors duration-200 ${
                    location.pathname === item.pathMatch ||
                    location.pathname === item.path
                      ? "bg-blue-500 text-white shadow-md"
                      : isDark
                      ? "text-gray-300 hover:bg-gray-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={20} className="mr-3" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={`flex-shrink-0 px-4 py-2 border-t ${
            isDark ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <ul className="space-y-1">
            <li>
              <Link
                to="/settings"
                onClick={onClose}
                className={`flex items-center w-full px-4 py-2 rounded-lg ${
                  location.pathname === "/settings"
                    ? "bg-blue-500 text-white shadow-md"
                    : isDark
                    ? "text-gray-300 hover:bg-gray-600"
                    : "text-gray-700 hover:bg-gray-100"
                } transition-colors duration-200`}
              >
                <Settings size={20} className="mr-3" />
                <span className="font-medium">Settings</span>
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                onClick={onClose}
                className={`flex items-center w-full px-4 py-2 rounded-lg ${
                  location.pathname === "/help"
                    ? "bg-blue-500 text-white shadow-md"
                    : isDark
                    ? "text-gray-300 hover:bg-gray-600"
                    : "text-gray-700 hover:bg-gray-100"
                } transition-colors duration-200`}
              >
                <HelpCircle size={20} className="mr-3" />
                <span className="font-medium">Help & Support</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

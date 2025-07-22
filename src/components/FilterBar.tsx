import React from "react";
import { Search } from "lucide-react";
import { useThemeContext } from "../context/ThemeContext";

export interface FilterBarProps {
  activeFilter: "all" | "pending" | "completed" | "overdue";
  onFilterChange: (filter: "all" | "pending" | "completed" | "overdue") => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
}) => {
  const { isDark } = useThemeContext();

  const filters: {
    key: "all" | "pending" | "completed" | "overdue";
    label: string;
  }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
    { key: "overdue", label: "Overdue" },
  ];

  return (
    <div
      className={`rounded-xl p-4 shadow-sm border ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } mb-6`}
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex-1 relative w-full sm:w-auto">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
            size={20}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSearchChange(e.target.value)
            }
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>

        <div
          className={`flex rounded-lg p-1 ${
            isDark ? "bg-gray-700" : "bg-gray-100"
          } mt-4 sm:mt-0`}
        >
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeFilter === filter.key
                  ? "bg-blue-500 text-white shadow-sm"
                  : isDark
                  ? "text-gray-400 hover:text-white hover:bg-gray-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

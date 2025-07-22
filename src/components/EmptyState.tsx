import React from "react";
import { Filter } from "lucide-react";
import { useThemeContext } from "../context/ThemeContext";

export interface EmptyStateProps {
  filter: "all" | "pending" | "completed" | "overdue";
}

const EmptyState: React.FC<EmptyStateProps> = ({ filter }) => {
  const { isDark } = useThemeContext();

  const messages: Record<typeof filter, string> = {
    all: "No tasks yet. Create your first task to get started!",
    pending: "No pending tasks. Great job!",
    completed: "No completed tasks yet. Time to finish some work!",
    overdue: "No overdue tasks. You're on top of things!",
  };

  return (
    <div className="text-center py-12">
      <div
        className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          isDark ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        <Filter
          className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
          size={24}
        />
      </div>
      <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        {messages[filter] || messages.all}
      </p>
    </div>
  );
};

export default EmptyState;

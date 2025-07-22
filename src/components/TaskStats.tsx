import React, { useMemo } from "react";
import type { Task } from "../types/task";
import { isOverdue } from "../utils/taskUtils";
import { useThemeContext } from "../context/ThemeContext";

export interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const { isDark } = useThemeContext();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const pending = tasks.filter((task) => task.status === "pending").length;
    const overdue = tasks.filter(
      (task) => isOverdue(task.dueDate) && task.status !== "completed"
    ).length;

    return { total, completed, pending, overdue };
  }, [tasks]);

  const statItems = [
    {
      label: "Total",
      value: stats.total,
      color: isDark ? "text-blue-400" : "text-blue-600",
    },
    {
      label: "Completed",
      value: stats.completed,
      color: isDark ? "text-green-400" : "text-green-600",
    },
    {
      label: "Pending",
      value: stats.pending,
      color: isDark ? "text-yellow-400" : "text-yellow-600",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      color: isDark ? "text-red-400" : "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {statItems.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl p-4 shadow-sm border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          <div
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;

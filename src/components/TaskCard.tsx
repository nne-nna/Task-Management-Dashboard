import React, { useState } from 'react';
import { Edit2, Trash2, Check, AlertCircle, Calendar } from 'lucide-react';
import type { Task } from '../types/task';
import { isOverdue, formatDate, getPriorityColor } from '../utils/taskUtils';
import { useThemeContext } from '../context/ThemeContext';

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
  onDragStart: (task: Task) => void;
  isDragging: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggleStatus, onDragStart, isDragging }) => {
  const { isDark } = useThemeContext();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onDelete(task.id);
    setIsDeleting(false);
  };

  const handleToggleStatus = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    onToggleStatus(task.id);
  };

  const cardClasses = `
    rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border cursor-grab
    ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    ${isDragging ? 'opacity-50 scale-95' : ''}
    ${task.status === 'completed' ? 'opacity-75' : ''}
    ${isOverdue(task.dueDate) && task.status !== 'completed' ? 'border-l-4 border-l-red-500' : ''}
  `;

  return (
    <div
      className={cardClasses}
      draggable
      onDragStart={() => onDragStart(task)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4
            className={`font-semibold truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            } ${task.status === 'completed' ? 'line-through' : ''}`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p
              className={`text-sm mt-1 line-clamp-2 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={handleToggleStatus}
            className={`p-1 rounded-lg transition-colors duration-200 ${
              task.status === 'completed'
                ? isDark
                  ? 'text-green-500 hover:bg-green-900/20'
                  : 'text-green-500 hover:bg-green-50'
                : isDark
                ? 'text-gray-400 hover:bg-gray-700 hover:text-green-500'
                : 'text-gray-400 hover:bg-gray-100 hover:text-green-500'
            }`}
            title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => onEdit(task)}
            className={`p-1 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'text-gray-400 hover:text-blue-500 hover:bg-blue-900/20'
                : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
            }`}
            title="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`p-1 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'text-gray-400 hover:text-red-500 hover:bg-red-900/20'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
            title="Delete task"
          >
            {isDeleting ? (
              <div
                className={`animate-spin rounded-full h-4 w-4 border-2 border-t-transparent ${
                  isDark ? 'border-red-500' : 'border-red-500'
                }`}
              ></div>
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
          >
            {task.priority}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              task.status === 'completed'
                ? isDark
                  ? 'bg-green-900/20 text-green-400'
                  : 'bg-green-100 text-green-800'
                : isDark
                ? 'bg-yellow-900/20 text-yellow-400'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {task.status}
          </span>
        </div>

        {task.dueDate && (
          <div
            className={`flex items-center gap-1 ${
              isOverdue(task.dueDate) && task.status !== 'completed'
                ? 'text-red-500'
                : isDark
                ? 'text-gray-400'
                : 'text-gray-500'
            }`}
          >
            {isOverdue(task.dueDate) && task.status !== 'completed' && (
              <AlertCircle size={12} />
            )}
            <Calendar size={12} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
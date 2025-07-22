import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { Task } from '../types/task';
import { isOverdue } from '../utils/taskUtils';
import { useThemeContext } from '../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TaskCompletionChartProps {
  tasks: Task[];
}

const TaskCompletionChart: React.FC<TaskCompletionChartProps> = ({ tasks }) => {
  const { isDark } = useThemeContext();

  const chartData = useMemo(() => {
    const completedCount = tasks.filter(task => task.status === 'completed').length;
    const pendingCount = tasks.filter(task => task.status === 'pending').length;
    const overdueCount = tasks.filter(task => isOverdue(task.dueDate) && task.status !== 'completed').length;

    const actualPendingCount = pendingCount - overdueCount;

    return {
      labels: ['Completed', 'Pending', 'Overdue'],
      datasets: [
        {
          data: [completedCount, actualPendingCount > 0 ? actualPendingCount : 0, overdueCount],
          backgroundColor: [
            isDark ? '#34D399' : '#10B981',
            isDark ? '#FCD34D' : '#F59E0B', 
            isDark ? '#F87171' : '#EF4444', 
          ],
          borderColor: isDark ? '#1F2937' : '#FFFFFF', 
          borderWidth: 2,
        },
      ],
    };
  }, [tasks, isDark]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: isDark ? '#D1D5DB' : '#374151',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((sum: number, current: number) => sum + current, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        },
      },
    },
    cutout: '70%', 
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        No tasks to display in the chart.
      </div>
    );
  }

  return (
    <div className="relative h-64 w-full flex items-center justify-center"> 
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default TaskCompletionChart;
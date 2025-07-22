/**
 * @returns
 */
export const generateId = (): string => Math.random().toString(36).substring(2, 11);

/**
 * @param dateString 
 * @returns 
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * @param dueDate 
 * @returns 
 */
export const isOverdue = (dueDate: string): boolean => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

/**
 * @param priority 
 * @returns
 */
export const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
  const colors = {
    high: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    medium: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    low: 'text-green-500 bg-green-50 dark:bg-green-900/20'
  };
  return colors[priority] || colors.medium;
}; 
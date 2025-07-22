export interface Task {
  id: string;
  title: string;
  description?: string;  // Only optional field
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  createdAt: string;
  category?: 'work' | 'personal' | 'breaks' | 'meetings';
  startTime: string;    // Required
  endTime: string;      // Required
}
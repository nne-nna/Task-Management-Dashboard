import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import FilterBar from '../components/FilterBar';
import TaskStats from '../components/TaskStats';
import EmptyState from '../components/EmptyState';
import TaskCompletionChart from '../components/TaskCompletionChart';
import useLocalStorage from '../hooks/useLocalStorage';
import { generateId, isOverdue } from '../utils/taskUtils';
import type { Task } from '../types/task';
import { useThemeContext } from '../context/ThemeContext';

export default function TaskManagementDashboard(): React.JSX.Element {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const { isDark } = useThemeContext();

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const activeFilter: 'all' | 'pending' | 'completed' | 'overdue' = (queryParams.get('filter') || 'all') as 'all' | 'pending' | 'completed' | 'overdue';
  const searchTerm: string = queryParams.get('search') || '';

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFilterChange = (newFilter: 'all' | 'pending' | 'completed' | 'overdue'): void => {
    const newParams = new URLSearchParams(queryParams);
    if (newFilter === 'all') {
      newParams.delete('filter');
    } else {
      newParams.set('filter', newFilter);
    }
    navigate({ search: newParams.toString() });
  };

  const handleSearchChange = (newSearchTerm: string): void => {
    const newParams = new URLSearchParams(queryParams);
    if (newSearchTerm.trim() === '') {
      newParams.delete('search');
    } else {
      newParams.set('search', newSearchTerm);
    }
    navigate({ search: newParams.toString() });
  };

  const filteredTasks = useMemo(() => {
    let filtered: Task[] = tasks;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        (task.description?.toLowerCase() || '').includes(searchLower)
      );
    }

    if (activeFilter !== 'all') {
      if (activeFilter === 'overdue') {
        filtered = filtered.filter(task =>
          isOverdue(task.dueDate) && task.status !== 'completed'
        );
      } else {
        filtered = filtered.filter(task => task.status === activeFilter);
      }
    }

    return filtered;
  }, [tasks, activeFilter, searchTerm]);

  const displayTasks = filteredTasks;

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'status'> & Partial<Pick<Task, 'id' | 'createdAt' | 'status'>>): Promise<void> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (editingTask) {
      setTasks(prev => prev.map(task =>
        task.id === editingTask.id
          ? { ...task, ...taskData } as Task
          : task
      ));
    } else {
      const newTask: Task = {
        id: generateId(),
        ...taskData,
        status: 'pending',
        createdAt: new Date().toISOString()
      } as Task;
      setTasks(prev => [newTask, ...prev]);
    }
    setIsLoading(false);
    setShowForm(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string): void => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleToggleStatus = (taskId: string): void => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const handleEditTask = (task: Task): void => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelForm = (): void => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex(task => task.id === active.id);
        const newIndex = tasks.findIndex(task => task.id === over?.id);

        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className={`max-w-full mx-auto px-4 py-8 w-full ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 lg:hidden`}>
          Task Management
        </h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Organize your work and boost productivity
        </p>
      </div>

      <TaskStats tasks={tasks} />

      <div className={`rounded-xl p-4 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} mb-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Task Status Overview</h3>
        <TaskCompletionChart tasks={tasks} />
      </div>

      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Task
        </button>
      </div>

      <div className="space-y-4 pb-8">
        {displayTasks.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={displayTasks.map(task => task.id)} 
              strategy={verticalListSortingStrategy}
            >
              {displayTasks.map((task: Task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={handleCancelForm}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
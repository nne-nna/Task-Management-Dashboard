import React, { useState, useEffect } from 'react';
import { Plus, Save } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  category: 'work' | 'personal' | 'breaks' | 'meetings';
  attendees?: string[];
}

interface EventFormProps {
  onSave: (event: CalendarEvent) => void;
  onCancel: () => void;
  initialData?: Partial<CalendarEvent>;
}

const EventForm: React.FC<EventFormProps> = ({ onSave, onCancel, initialData }) => {
  const { isDark } = useThemeContext();
  const [formData, setFormData] = useState<Partial<CalendarEvent>>(initialData || {});
  const [errors, setErrors] = useState<Partial<Record<keyof CalendarEvent, string>>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setFormData(initialData || {});
    setIsFormValid(validateForm());
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CalendarEvent, string>> = {};

    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.date);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else {
      const start = new Date(`1970-01-01 ${formData.startTime}:00`);
      const end = new Date(`1970-01-01 ${formData.endTime}:00`);
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    } else {
      const validCategories = ['work', 'personal', 'breaks', 'meetings'] as const;
      if (!validCategories.includes(formData.category as any)) {
        newErrors.category = 'Invalid category';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  const handleChange = (field: keyof CalendarEvent, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newEvent: CalendarEvent = {
        id: formData.id || Date.now().toString(),
        title: formData.title!,
        date: formData.date!,
        startTime: formData.startTime!,
        endTime: formData.endTime!,
        category: formData.category as 'work' | 'personal' | 'breaks' | 'meetings',
        description: formData.description || '',
        attendees: formData.attendees || [],
      };
      onSave(newEvent);
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div
      className={`fixed inset-0 ${isDark ? 'bg-gray-800/20' : 'bg-gray-200/20'} backdrop-blur-xs flex items-center justify-center p-4 z-50`}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-form-title"
      onKeyDown={handleKeyDown}
    >
      <div
        className={`rounded-xl p-4 max-w-sm w-10/12 border ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="event-form-title"
          className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          {initialData?.id ? 'Edit Event' : 'Add New Event'}
        </h3>
        <div className="space-y-2">
          <div>
            <label
              htmlFor="event-title"
              className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}
            >
              Title *
            </label>
            <input
              type="text"
              id="event-title"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
              placeholder="e.g., Team Meeting"
              aria-required="true"
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>
          <div>
            <label
              htmlFor="event-date"
              className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}
            >
              Date *
            </label>
            <input
              type="date"
              id="event-date"
              value={formData.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`w-full px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
              min={new Date().toISOString().split('T')[0]}
              aria-required="true"
            />
            {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="event-start"
                className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}
              >
                Start Time *
              </label>
              <input
                type="time"
                id="event-start"
                value={formData.startTime || ''}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className={`w-full px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
                }`}
                aria-required="true"
              />
              {errors.startTime && <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>}
            </div>
            <div>
              <label
                htmlFor="event-end"
                className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}
              >
                End Time *
              </label>
              <input
                type="time"
                id="event-end"
                value={formData.endTime || ''}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className={`w-full px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                  isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
                }`}
                aria-required="true"
              />
              {errors.endTime && <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>}
            </div>
          </div>
          <div>
            <label
              htmlFor="event-category"
              className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}
            >
              Category *
            </label>
            <select
              id="event-category"
              value={formData.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
              aria-required="true"
            >
              <option value="">Select Category</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="breaks">Breaks</option>
              <option value="meetings">Meetings</option>
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>
          <div>
            <label
              htmlFor="event-description"
              className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}
            >
              Description
            </label>
            <textarea
              id="event-description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`w-full px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
              placeholder="e.g., Discuss project milestones"
              rows={3}
            />
          </div>
          <div>
            <label
              htmlFor="event-attendees"
              className={`block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}
            >
              Attendees
            </label>
            <input
              type="text"
              id="event-attendees"
              value={formData.attendees?.join(', ') || ''}
              onChange={(e) => handleChange('attendees', e.target.value.split(',').map((item) => item.trim()))}
              className={`w-full px-2 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                isDark ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
              }`}
              placeholder="e.g., John Doe, Jane Smith"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className={`px-3 py-1 rounded-lg font-medium transition-colors duration-200 text-sm ${
                isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={initialData?.id ? 'Save changes' : 'Add event'}
            >
              {initialData?.id ? <Save size={14} /> : <Plus size={14} />}
              {initialData?.id ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
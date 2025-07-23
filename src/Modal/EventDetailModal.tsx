import React from 'react';
import { X, Users, Tag, Clock, Trash2, Edit } from 'lucide-react';
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

interface EventDetailModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (event: CalendarEvent) => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, onDelete, onEdit }) => {
  const { isDark } = useThemeContext();

  const categoryColors = {
    work: isDark ? 'text-orange-300' : 'text-orange-800',
    personal: isDark ? 'text-blue-300' : 'text-blue-800',
    breaks: isDark ? 'text-red-300' : 'text-red-800',
    meetings: isDark ? 'text-green-300' : 'text-green-800',
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className={`fixed inset-0 ${isDark ? 'bg-gray-800/60' : 'bg-gray-200/60'} backdrop-blur-sm flex items-center justify-center p-4 z-50`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      onKeyDown={handleKeyDown}
    >
      <div
        className={`rounded-xl p-6 max-w-md w-11/12 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="event-modal-title" className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {event.title}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
            <Clock size={16} className={`${categoryColors[event.category]}`} />
            <span>{new Date(event.date).toDateString()} from {formatTime(event.startTime)} to {formatTime(event.endTime)}</span>
          </p>
          {event.description && (
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>Description:</strong> {event.description}
            </p>
          )}
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
            <Tag size={16} className={`${categoryColors[event.category]}`} />
            <span>Category: <span className="capitalize">{event.category}</span></span>
          </p>
          {event.attendees && event.attendees.length > 0 && (
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
              <Users size={16} className={`${categoryColors[event.category]}`} />
              <span>Attendees: {event.attendees.join(', ')}</span>
            </p>
          )}
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <button
            onClick={() => onEdit(event)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
            aria-label="Edit event"
          >
            <Edit size={16} /> Edit Event
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
            aria-label="Delete event"
          >
            <Trash2 size={16} /> Delete Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
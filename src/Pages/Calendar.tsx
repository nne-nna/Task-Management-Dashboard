import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Users, Trash2 } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Task } from '../types/task';
import EventForm from '../components/EventForm';

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

interface CalendarPageProps {}

const Calendar: React.FC<CalendarPageProps> = () => {
  const { isDark } = useThemeContext();
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('calendar-events', []);
  const [tasks] = useLocalStorage<Task[]>('tasks', []);
  const [currentDate, setCurrentDate] = useState(new Date('2025-07-22T20:21:00+02:00')); 
  const [view, setView] = useState<'month' | 'week' | 'day'>('week');
  const [showEventForm, setShowEventForm] = useState(false);

  useEffect(() => {
    const validCategories = ['work', 'personal', 'breaks', 'meetings'] as const;
    const taskIds = new Set(tasks.map(t => t.id));

    const updatedEvents = events.reduce((acc: CalendarEvent[], event) => {
      const correspondingTask = tasks.find(task => task.id === event.id);
      if (correspondingTask) {
        acc.push({
          id: correspondingTask.id,
          title: correspondingTask.title,
          description: correspondingTask.description,
          date: correspondingTask.dueDate || new Date().toISOString().split('T')[0],
          startTime: correspondingTask.startTime || '09:00', 
          endTime: correspondingTask.endTime || '10:00',     
          category: (validCategories.includes(correspondingTask.category as any) ? correspondingTask.category : 'work') as typeof validCategories[number],
          attendees: event.attendees
        });
      } else if (!taskIds.has(event.id)) {
        acc.push(event);
      }
      return acc;
    }, []);

    tasks.forEach(task => {
      if (!updatedEvents.some(event => event.id === task.id)) {
        updatedEvents.push({
          id: task.id,
          title: task.title,
          description: task.description,
          date: task.dueDate || new Date().toISOString().split('T')[0],
          startTime: task.startTime || '09:00', 
          endTime: task.endTime || '10:00',     
          category: (validCategories.includes(task.category as any) ? task.category : 'work') as typeof validCategories[number],
        });
      }
    });
    setEvents(updatedEvents);
  }, [tasks]);

  const categoryColors = {
    work: isDark ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' : 'bg-orange-100 text-orange-800 border-orange-200',
    personal: isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-800 border-blue-200',
    breaks: isDark ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-red-100 text-red-800 border-red-200',
    meetings: isDark ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-green-100 text-green-800 border-green-200',
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(date.getDate() - day);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const dates = [];
    for (let i = 0; i < firstDayIndex; i++) dates.push(null);
    for (let day = 1; day <= daysInMonth; day++) dates.push(new Date(year, month, day));
    return dates;
  };

  const weekDates = getWeekDates(currentDate);
  const monthDates = getMonthDates(currentDate);

  const getEventsForDate = (date: Date) => {
    if (!date) return [];
    return events.filter(event => event.date === date.toISOString().split('T')[0]);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getEventPosition = (event: CalendarEvent, overlappingEvents: CalendarEvent[]) => {
    const startHour = parseInt(event.startTime.split(':')[0]);
    const startMinute = parseInt(event.startTime.split(':')[1]) / 60;
    const endHour = parseInt(event.endTime.split(':')[0]);
    const endMinute = parseInt(event.endTime.split(':')[1]) / 60;
    const startPosition = (startHour + startMinute) * 60;
    const durationMinutes = ((endHour - startHour) * 60) + (endMinute - startMinute) * 60; 
    const height = durationMinutes || 40; 

    const columnCount = Math.max(1, overlappingEvents.length);
    const columnWidth = 100 / columnCount;
    const columnIndex = overlappingEvents.findIndex(e => e.id === event.id);
    const left = columnIndex >= 0 ? (columnIndex * columnWidth) + '%' : '0%';
    const width = columnIndex >= 0 ? `${columnWidth}%` : '100%';

    return { top: startPosition, height: Math.max(height, 40), left, width };
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    setEvents(prev => [...prev, event]);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <div className={`max-w-full mx-auto px-4 py-8 w-full ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Calendar</h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your schedule and events</p>
      </div>

      <div className={`rounded-xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} mb-6`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (view === 'month') navigateMonth('prev');
                else if (view === 'week') navigateWeek('prev');
                else navigateDay('prev');
              }}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {view === 'month' ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}` : `${weekDays[currentDate.getDay()]}, ${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            </h2>
            <button
              onClick={() => {
                if (view === 'month') navigateMonth('next');
                else if (view === 'week') navigateWeek('next');
                else navigateDay('next');
              }}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-1`}>
              {(['day', 'week', 'month'] as const).map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType)}
                  className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition-colors ${
                    view === viewType ? 'bg-blue-500 text-white' : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {viewType}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowEventForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={16} /> Add Event
            </button>
          </div>
        </div>

        {view === 'week' && (
          <div className="grid grid-cols-8 gap-0 border rounded-lg overflow-hidden">
            <div className={`p-3 text-center font-medium border-b ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>Time</div>
            {weekDates.map((date, index) => (
              <div
                key={index}
                className={`p-3 text-center border-b ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="font-medium">{weekDays[index]}</div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{date.getDate()}</div>
              </div>
            ))}
            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <div className={`p-2 text-xs text-center border-b border-r ${isDark ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>{time}</div>
                {weekDates.map((date, dayIndex) => {
                  const dayEvents = getEventsForDate(date);
                  return (
                    <div
                      key={`${dayIndex}-${time}`}
                      className={`relative min-h-[60px] border-b border-r ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                      style={{ height: '60px' }} // Fixed height per slot
                    >
                      {dayEvents.map((event) => {
                        const position = getEventPosition(event, dayEvents.filter(e => e.date === event.date && e.startTime <= event.endTime && e.endTime >= event.startTime));
                        const eventStartHour = parseInt(event.startTime.split(':')[0]);
                        const slotHour = parseInt(time.split(':')[0]);
                        if (eventStartHour === slotHour || (eventStartHour < slotHour && parseInt(event.endTime.split(':')[0]) >= slotHour)) {
                          return (
                            <div
                              key={event.id}
                              className={`absolute rounded px-2 py-1 text-xs border ${categoryColors[event.category]} cursor-pointer hover:shadow-md transition-shadow group`}
                              style={{
                                top: 0, 
                                height: position.height,
                                left: position.left,
                                width: position.width,
                                zIndex: dayEvents.findIndex(e => e.id === event.id) + 1
                              }}
                            >
                              <div className="font-medium truncate">{formatTime(event.startTime)}</div>
                              <div className="truncate">{event.title}</div>
                              {event.attendees && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Users size={10} />
                                  <span className="truncate">{event.attendees.length}</span>
                                </div>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEvent(event.id);
                                }}
                                className="absolute top-1 right-1 p-0.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                title="Delete event"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}

        {view === 'day' && (
          <div className="grid grid-cols-2 gap-0 border rounded-lg overflow-hidden">
            <div className={`p-3 text-center font-medium border-b ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>Time</div>
            <div className={`p-3 text-center font-medium border-b ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>Events</div>
            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <div className={`p-2 text-xs text-center border-b border-r ${isDark ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>{time}</div>
                <div
                  className={`relative min-h-[60px] border-b border-r ${isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                  style={{ height: '60px' }} 
                >
                  {getEventsForDate(currentDate).map((event) => {
                    const position = getEventPosition(event, getEventsForDate(currentDate).filter(e => e.date === event.date && e.startTime <= event.endTime && e.endTime >= event.startTime));
                    const eventStartHour = parseInt(event.startTime.split(':')[0]);
                    const slotHour = parseInt(time.split(':')[0]);
                    if (eventStartHour === slotHour || (eventStartHour < slotHour && parseInt(event.endTime.split(':')[0]) >= slotHour)) {
                      return (
                        <div
                          key={event.id}
                          className={`absolute rounded px-2 py-1 text-xs border ${categoryColors[event.category]} cursor-pointer hover:shadow-md transition-shadow group`}
                          style={{
                            top: 0, 
                            height: position.height,
                            left: position.left,
                            width: position.width,
                            zIndex: getEventsForDate(currentDate).findIndex(e => e.id === event.id) + 1
                          }}
                        >
                          <div className="font-medium truncate">{formatTime(event.startTime)}</div>
                          <div className="truncate">{event.title}</div>
                          {event.attendees && (
                            <div className="flex items-center gap-1 mt-1">
                              <Users size={10} />
                              <span className="truncate">{event.attendees.length}</span>
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(event.id);
                            }}
                            className="absolute top-1 right-1 p-0.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            title="Delete event"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {view === 'month' && (
          <div className="grid grid-cols-7 gap-0 border rounded-lg overflow-hidden">
            {weekDays.map((day) => (
              <div
                key={day}
                className={`p-3 text-center font-medium border-b ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
              >
                {day}
              </div>
            ))}
            {monthDates.map((date, index) => (
              <div
                key={index}
                className={`relative p-2 text-center border ${date ? (isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100') : 'bg-transparent'} border-r ${isDark ? 'border-gray-600' : 'border-gray-200'} ${index % 7 === 6 ? '' : 'border-r'}`}
              >
                {date && <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{date.getDate()}</div>}
                {date && getEventsForDate(date).length > 0 && (
                  <div className="mt-1 text-xs space-y-1">
                    {getEventsForDate(date).slice(0, 2).map(event => (
                      <div key={event.id} className={`flex justify-between items-center truncate ${categoryColors[event.category]} group p-1 rounded`}>
                        <span className="truncate">{event.title}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                          }}
                          className="ml-1 p-0.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          title="Delete event"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))}
                    {getEventsForDate(date).length > 2 && (
                      <div className="text-xs text-gray-400">+{getEventsForDate(date).length - 2} more</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`rounded-xl p-6 shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} mb-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>My Schedule Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries({
            work: { name: 'Work', count: events.filter(e => e.category === 'work').length, icon: '🏢' },
            meetings: { name: 'Meetings', count: events.filter(e => e.category === 'meetings').length, icon: '👥' },
            personal: { name: 'Personal', count: events.filter(e => e.category === 'personal').length, icon: '🏠' },
            breaks: { name: 'Breaks', count: events.filter(e => e.category === 'breaks').length, icon: '☕' }
          }).map(([key, category]) => (
            <div
              key={key}
              className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${categoryColors[key as keyof typeof categoryColors]}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{category.name}</div>
                  <div className="text-lg font-bold">{category.count}</div>
                </div>
                <div className="text-2xl">{category.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showEventForm && (
        <EventForm onSave={handleSaveEvent} onCancel={() => setShowEventForm(false)} />
      )}
    </div>
  );
};

export default Calendar;
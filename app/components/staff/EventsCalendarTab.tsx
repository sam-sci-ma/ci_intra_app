'use client';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import { format, parse, startOf, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';

const locales = {
  'en-US': enUS
};

const localizer = momentLocalizer(require('moment'));

interface EventsCalendarTabProps {
  events: any[];
  onEdit: (event: any) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export default function EventsCalendarTab({
  events,
  onEdit,
  onDelete,
  onAdd
}: EventsCalendarTabProps) {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // January 2026

  // Transform events for the calendar
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(event.startDate || event.date),
    end: new Date(event.endDate || event.date),
    resource: event
  }));

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event.resource);
  };

  const handleSelectSlot = (slotInfo: any) => {
    onAdd();
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToMonth = (monthIndex: number) => {
    setCurrentDate(new Date(currentYear, monthIndex, 1));
  };

  return (
    <div className="space-y-6">
      {/* Add Event Button */}
      <div className="flex justify-end">
        <button
          onClick={onAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Month/Year Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{months[currentMonth]} {currentYear}</h3>
          <div className="flex gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Month Buttons */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => goToMonth(index)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentMonth === index
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {month.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <style>{`
          .rbc-calendar {
            font-family: inherit;
          }
          .rbc-header {
            padding: 12px 4px;
            font-weight: 600;
            color: #374151;
            background-color: #f9fafb;
            border-bottom: 2px solid #e5e7eb;
          }
          .rbc-today {
            background-color: #eff6ff;
          }
          .rbc-off-range-bg {
            background-color: #fafafa;
          }
          .rbc-event {
            background-color: #4f46e5;
            border: none;
            border-radius: 6px;
            padding: 2px 6px;
          }
          .rbc-event:hover {
            background-color: #4338ca;
          }
          .rbc-event-label {
            font-size: 11px;
          }
          .rbc-event-content {
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .rbc-day-bg {
            border-right: 1px solid #e5e7eb;
          }
          .rbc-time-slot {
            border-top: 1px solid #f3f4f6;
          }
          .rbc-toolbar {
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 10px;
          }
          .rbc-toolbar button {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            background-color: white;
            border-radius: 6px;
            color: #374151;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .rbc-toolbar button:hover {
            background-color: #f3f4f6;
            border-color: #9ca3af;
          }
          .rbc-toolbar button.rbc-active {
            background-color: #4f46e5;
            color: white;
            border-color: #4f46e5;
          }
          .rbc-toolbar label {
            margin: 0;
          }
        `}</style>
        
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          popup
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          date={currentDate}
          onNavigate={setCurrentDate}
        />
      </div>

      {/* Selected Event Details */}
      {selectedEvent && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{selectedEvent.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedEvent.location}</p>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Date</p>
              <p className="text-gray-900">{format(new Date(selectedEvent.startDate || selectedEvent.date), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Time</p>
              <p className="text-gray-900">{selectedEvent.time || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Organizer</p>
              <p className="text-gray-900">{selectedEvent.organizer}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Category</p>
              <p className="text-gray-900">{selectedEvent.eventType || selectedEvent.category}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onEdit(selectedEvent)}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Event
            </button>
            <button
              onClick={() => {
                onDelete(selectedEvent.id);
                setSelectedEvent(null);
              }}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

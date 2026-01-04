'use client';

import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

/* =====================
   Localizer
===================== */

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales
});

/* =====================
   Props
===================== */

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
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 0, 1));

  /* =====================
     Calendar events
  ===================== */

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

  const handleSelectSlot = () => {
    onAdd();
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
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

      {/* Month Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {months[currentMonth]} {currentYear}
          </h3>
          <div className="flex gap-2">
            <button onClick={goToPreviousMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => goToMonth(index)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
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
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          popup
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          date={currentDate}
          onNavigate={setCurrentDate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
        />
      </div>

      {/* Selected Event */}
      {selectedEvent && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
              <p className="text-sm text-gray-600">{selectedEvent.location}</p>
            </div>
            <button onClick={() => setSelectedEvent(null)}>✕</button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Date</p>
              <p>{format(new Date(selectedEvent.startDate || selectedEvent.date), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Time</p>
              <p>{selectedEvent.time || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onEdit(selectedEvent)}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => {
                onDelete(selectedEvent.id);
                setSelectedEvent(null);
              }}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

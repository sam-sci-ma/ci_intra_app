"use client";

import { useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Edit2,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon
} from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

/* =====================
   Localizer
===================== */

const locales = {
  "en-US": enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales
});

/* =====================
   Types
===================== */

interface CalendarEvent {
  id?: number;
  title: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  time?: string;
  location?: string;
  organizer?: string;
  category?: string;
  eventType?: string;

  created_by?: string;
  owner_name?: string;
}

interface EventsCalendarTabProps {
  events: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  showActions?: boolean; // Whether to show Add/Edit/Delete buttons
}

/* =====================
   Component
===================== */

export default function EventsCalendarTab({
  events,
  onEdit,
  onDelete,
  onAdd,
  showActions = true
}: EventsCalendarTabProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState<Date>(new Date(2026, 0, 1));

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: new Date(event.startDate || event.date || ""),
    end: new Date(event.endDate || event.date || ""),
    resource: event
  }));

  const handleSelectEvent = (event: { resource: CalendarEvent }) => {
    setSelectedEvent(event.resource);
  };

  const handleSelectSlot = () => {
    onAdd();
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  const goToPreviousMonth = () => {
    setDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToMonth = (monthIndex: number) => {
    setDate(new Date(currentYear, monthIndex, 1));
  };

  return (
    <div className="space-y-6">
      {showActions && (
        <div className="flex justify-end">
          <button
            onClick={onAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      )}

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
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {month.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          selectable
          popup
          views={["month", "week", "day", "agenda"]}
          view={view}
          onView={setView}
          defaultView="month"
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          culture="en-US"
          formats={{
            dateFormat: 'dd',
            dayFormat: (date: Date, culture?: string, localizer?: any) => 
              localizer.format(date, 'EEE', culture),
            weekdayFormat: (date: Date, culture?: string, localizer?: any) => 
              localizer.format(date, 'EEEE', culture),
            monthHeaderFormat: (date: Date, culture?: string, localizer?: any) => 
              localizer.format(date, 'MMMM yyyy', culture),
            dayHeaderFormat: (date: Date, culture?: string, localizer?: any) => 
              localizer.format(date, 'EEEE MMM dd', culture),
            dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }, culture?: string, localizer?: any) =>
              `${localizer.format(start, 'MMM dd', culture)} - ${localizer.format(end, 'MMM dd', culture)}`,
            agendaHeaderFormat: ({ start, end }: { start: Date; end: Date }, culture?: string, localizer?: any) =>
              `${localizer.format(start, 'MMM dd', culture)} - ${localizer.format(end, 'MMM dd', culture)}`,
          }}
        />
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h3>
                {selectedEvent.category && (
                  <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                    {selectedEvent.category || selectedEvent.eventType}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-light leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Date & Time</p>
                  <p className="text-gray-900">
                    {format(
                      new Date(selectedEvent.startDate || selectedEvent.date || ""),
                      "EEEE, MMMM dd, yyyy"
                    )}
                  </p>
                  <p className="text-gray-600 text-sm">{selectedEvent.time || "Time not specified"}</p>
                </div>
              </div>

              {selectedEvent.location && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Location</p>
                    <p className="text-gray-900">{selectedEvent.location}</p>
                  </div>
                </div>
              )}

              {selectedEvent.organizer && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Organizer</p>
                    <p className="text-gray-900">{selectedEvent.organizer}</p>
                  </div>
                </div>
              )}

              {selectedEvent.owner_name && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Created By</p>
                    <p className="text-gray-900">{selectedEvent.owner_name}</p>
                  </div>
                </div>
              )}
            </div>

            {showActions && (
              <div className="flex gap-3">
                <button
                  onClick={() => onEdit(selectedEvent)}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (selectedEvent.id !== undefined) {
                      onDelete(selectedEvent.id);
                    }
                    setSelectedEvent(null);
                  }}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

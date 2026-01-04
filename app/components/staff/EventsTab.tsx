import { Edit2, Trash2, Calendar, Users, Plus, Search } from 'lucide-react';

interface EventsTabProps {
  events: any[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (event: any) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export default function EventsTab({
  events,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  onAdd
}: EventsTabProps) {
  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={onAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="grid gap-4">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                    {event.category}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {event.date} at {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    {event.attendees} attendees
                  </div>
                  <div className="text-gray-600">Location: {event.location}</div>
                  <div className="text-gray-600">Organizer: {event.organizer}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(event)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

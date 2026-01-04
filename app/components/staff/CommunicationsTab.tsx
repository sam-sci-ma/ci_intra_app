import { Edit2, Trash2, Plus, Search } from 'lucide-react';

interface CommunicationsTabProps {
  communications: any[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (comm: any) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

function getPriorityColor(priority: string) {
  switch(priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-orange-100 text-orange-800';
    case 'low': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default function CommunicationsTab({
  communications,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  onAdd
}: CommunicationsTabProps) {
  const filteredCommunications = communications.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search communications..."
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
          Add Announcement
        </button>
      </div>

      <div className="grid gap-4">
        {filteredCommunications.map(comm => (
          <div key={comm.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{comm.title}</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(comm.priority)}`}>
                    {comm.priority} priority
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{comm.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>By {comm.author}</span>
                  <span>•</span>
                  <span>{comm.date}</span>
                  <span>•</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">{comm.category}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(comm)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(comm.id)}
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

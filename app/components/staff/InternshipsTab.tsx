import { Edit2, Trash2, Plus, Search, Briefcase, User } from 'lucide-react';

interface InternshipsTabProps {
  internships: any[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (internship: any) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

function getStatusColor(status: string) {
  switch(status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export default function InternshipsTab({
  internships,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  onAdd
}: InternshipsTabProps) {
  const filteredInternships = internships.filter(i =>
    i.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search internships..."
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
          Add Internship
        </button>
      </div>

      <div className="grid gap-4">
        {filteredInternships.map(internship => (
          <div key={internship.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{internship.position}</h3>
                    <p className="text-sm text-gray-600">{internship.company}</p>
                  </div>
                  <span className={`ml-auto px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(internship.status)}`}>
                    {internship.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Student</p>
                      <p className="text-gray-900 font-medium">{internship.student}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Supervisor</p>
                    <p className="text-gray-900 font-medium">{internship.supervisor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{internship.startDate} to {internship.endDate}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(internship)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(internship.id)}
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

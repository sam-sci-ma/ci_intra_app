import { Edit2, Trash2, Plus, Search, CheckCircle, Circle, TrendingUp } from 'lucide-react';

interface AdmissionsTabProps {
  admissionsMetrics: any[];
  campaigns: any[];
  milestones: any[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEditCampaign: (campaign: any) => void;
  onDeleteCampaign: (id: number) => void;
  onAddCampaign: () => void;
  onEditMilestone: (milestone: any) => void;
  onDeleteMilestone: (id: number) => void;
  onAddMilestone: () => void;
  onToggleMilestone: (id: number, completed: boolean) => void;
}

export default function AdmissionsTab({
  admissionsMetrics,
  campaigns,
  milestones,
  searchTerm,
  onSearchChange,
  onEditCampaign,
  onDeleteCampaign,
  onAddCampaign,
  onEditMilestone,
  onDeleteMilestone,
  onAddMilestone,
  onToggleMilestone
}: AdmissionsTabProps) {
  // Get first metrics object or defaults
  const metrics = admissionsMetrics[0] || {
    totalApplicants: 0,
    acceptedStudents: 0,
    confirmedEnrollments: 0
  };

  const maxApplicants = 500;
  const acceptanceRate = metrics.totalApplicants > 0 ? (metrics.acceptedStudents / metrics.totalApplicants * 100).toFixed(1) : 0;
  const enrollmentRate = metrics.acceptedStudents > 0 ? (metrics.confirmedEnrollments / metrics.acceptedStudents * 100).toFixed(1) : 0;

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMilestones = milestones.filter(m =>
    (m.title || m.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Applicants Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Applicants</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-4">{metrics.totalApplicants}</p>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `MAD{(metrics.totalApplicants / maxApplicants) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{Math.round((metrics.totalApplicants / maxApplicants) * 100)}% of target</p>
        </div>

        {/* Accepted Students Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Accepted Students</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-4">{metrics.acceptedStudents}</p>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `MAD{acceptanceRate}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{acceptanceRate}% acceptance rate</p>
        </div>

        {/* Confirmed Enrollments Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Confirmed Enrollments</h3>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-4">{metrics.confirmedEnrollments}</p>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `MAD{enrollmentRate}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{enrollmentRate}% yield rate</p>
        </div>
      </div>

      {/* Campaigns Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Marketing Campaigns</h3>
          <button
            onClick={onAddCampaign}
            className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Campaign
          </button>
        </div>
        <div className="grid gap-4">
          {filteredCampaigns.map(campaign => (
            <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                  <div className="flex gap-4 mt-3 text-sm text-gray-600">
                    <span>Budget: MAD{campaign.budget?.toLocaleString() || 0}</span>
                    <span>Leads: {campaign.leads || 0}</span>
                    <span>Start: {campaign.startDate}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditCampaign(campaign)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCampaign(campaign.id)}
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

      {/* Milestones Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Key Milestones</h3>
          <button
            onClick={onAddMilestone}
            className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Milestone
          </button>
        </div>
        <div className="space-y-3">
          {filteredMilestones.map(milestone => (
            <div key={milestone.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => onToggleMilestone(milestone.id, !milestone.completed)}
                  className="pt-1 text-gray-600 hover:text-indigo-600 flex-shrink-0"
                >
                  {milestone.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={`font-medium MAD{milestone.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {milestone.title || milestone.description}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Due: {milestone.dueDate || milestone.due_date}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditMilestone(milestone)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteMilestone(milestone.id)}
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
    </div>
  );
}

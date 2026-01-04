// FILE: app/page.js
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Calendar, Users, Briefcase, MessageSquare, Plus, X, Edit2, Trash2, Check, Bell, Search, Award, Target, TrendingUp } from 'lucide-react';

export default function SCIIntranet() {
  const [activeTab, setActiveTab] = useState('events');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Events state (loaded from Supabase)
  const [events, setEvents] = useState([]);

  // Communications state (loaded from Supabase)
  const [communications, setCommunications] = useState([]);

  // Internships state (loaded from Supabase)
  const [internships, setInternships] = useState([]);

  // Admissions 2026 Campaign state (metrics + lists loaded from Supabase)
  const [admissions, setAdmissions] = useState({
    totalApplicants: 0,
    targetApplicants: 0,
    acceptedStudents: 0,
    targetAcceptance: 0,
    confirmedEnrollments: 0,
    targetEnrollments: 0,
    campaigns: [],
    milestones: []
  });

  // Load data from Supabase on mount
  useEffect(() => {
    const load = async () => {
      try {
        const { data: ev } = await supabase.from('events').select('*').order('date', { ascending: true });
        if (ev) setEvents(ev.map((e: any) => ({ ...e, time: e.time?.slice(0,5) })));

        const { data: comm } = await supabase.from('communications').select('*').order('date', { ascending: false });
        if (comm) setCommunications(comm);

        const { data: ints } = await supabase.from('internships').select('*').order('start_date', { ascending: false });
        if (ints) setInternships(ints.map((i: any) => ({ ...i, startDate: i.start_date || i.startDate, endDate: i.end_date || i.endDate })));

        const { data: camps } = await supabase.from('campaigns').select('*').order('start_date', { ascending: false });
        const { data: miles } = await supabase.from('milestones').select('*');
        const { data: metrics } = await supabase.from('admissions_metrics').select('*').limit(1);

        setAdmissions(prev => ({
          ...prev,
          campaigns: camps ? camps.map((c: any) => ({ ...c, startDate: c.start_date || c.startDate, endDate: c.end_date || c.endDate })) : [],
          milestones: miles ? miles.map((m: any) => ({ ...m, date: m.target_date || m.date, completed: !!m.completed })) : [],
          ...(metrics && metrics[0] ? {
            totalApplicants: metrics[0].total_applicants || prev.totalApplicants,
            targetApplicants: metrics[0].target_applicants || prev.targetApplicants,
            acceptedStudents: metrics[0].accepted_students || prev.acceptedStudents,
            targetAcceptance: metrics[0].target_acceptance || prev.targetAcceptance,
            confirmedEnrollments: metrics[0].confirmed_enrollments || prev.confirmedEnrollments,
            targetEnrollments: metrics[0].target_enrollments || prev.targetEnrollments
          } : {})
        }));
      } catch (err) {
        /* ignore load errors for now */
        console.error('Supabase load error', err);
      }
    };
    load();
  }, []);

  const [formData, setFormData] = useState({});

  const openModal = (type, data = {}) => {
    setModalType(type);
    setFormData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType.includes('event')) {
      if (modalType === 'add-event') {
        setEvents([...events, { ...formData, id: Date.now(), attendees: 0 }]);
      } else if (modalType === 'edit-event') {
        setEvents(events.map(ev => ev.id === formData.id ? formData : ev));
      }
    } else if (modalType.includes('communication')) {
      if (modalType === 'add-communication') {
        setCommunications([...communications, { ...formData, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
      } else if (modalType === 'edit-communication') {
        setCommunications(communications.map(comm => comm.id === formData.id ? formData : comm));
      }
    } else if (modalType.includes('internship')) {
      if (modalType === 'add-internship') {
        setInternships([...internships, { ...formData, id: Date.now() }]);
      } else if (modalType === 'edit-internship') {
        setInternships(internships.map(int => int.id === formData.id ? formData : int));
      }
    } else if (modalType.includes('campaign')) {
      if (modalType === 'add-campaign') {
        setAdmissions({
          ...admissions,
          campaigns: [...admissions.campaigns, { ...formData, id: Date.now() }]
        });
      } else if (modalType === 'edit-campaign') {
        setAdmissions({
          ...admissions,
          campaigns: admissions.campaigns.map(camp => camp.id === formData.id ? formData : camp)
        });
      }
    } else if (modalType.includes('milestone')) {
      if (modalType === 'add-milestone') {
        setAdmissions({
          ...admissions,
          milestones: [...admissions.milestones, { ...formData, id: Date.now(), completed: false }]
        });
      } else if (modalType === 'edit-milestone') {
        setAdmissions({
          ...admissions,
          milestones: admissions.milestones.map(mile => mile.id === formData.id ? formData : mile)
        });
      }
    }
    
    closeModal();
  };

  const deleteItem = (type, id) => {
    if (type === 'event') setEvents(events.filter(e => e.id !== id));
    if (type === 'communication') setCommunications(communications.filter(c => c.id !== id));
    if (type === 'internship') setInternships(internships.filter(i => i.id !== id));
    if (type === 'campaign') {
      setAdmissions({
        ...admissions,
        campaigns: admissions.campaigns.filter(c => c.id !== id)
      });
    }
    if (type === 'milestone') {
      setAdmissions({
        ...admissions,
        milestones: admissions.milestones.filter(m => m.id !== id)
      });
    }
  };

  const toggleMilestone = (id) => {
    setAdmissions({
      ...admissions,
      milestones: admissions.milestones.map(m => 
        m.id === id ? { ...m, completed: !m.completed } : m
      )
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommunications = communications.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInternships = internships.filter(i =>
    i.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCampaigns = admissions.campaigns.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-indigo-900">School of Collective Intelligence</h1>
              <p className="text-sm text-gray-600">Staff Intranet Portal</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  JS
                </div>
                <span className="text-sm font-medium text-gray-700">John Smith</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'events'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Events
            </button>
            <button
              onClick={() => setActiveTab('communications')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'communications'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Communications
            </button>
            <button
              onClick={() => setActiveTab('internships')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'internships'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Internships
            </button>
            <button
              onClick={() => setActiveTab('admissions')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'admissions'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Award className="w-4 h-4" />
              Admissions 2026
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Action Bar */}
        {activeTab !== 'admissions' && (
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => openModal(`add-${activeTab.slice(0, -1)}`)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add {activeTab === 'communications' ? 'Announcement' : activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
            </button>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
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
                      onClick={() => openModal('edit-event', event)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem('event', event.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Communications Tab */}
        {activeTab === 'communications' && (
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
                      onClick={() => openModal('edit-communication', comm)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem('communication', comm.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Internships Tab */}
        {activeTab === 'internships' && (
          <div className="grid gap-4">
            {filteredInternships.map(internship => (
              <div key={internship.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{internship.position}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(internship.status)}`}>
                        {internship.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Company:</span>
                        <span className="ml-2 text-gray-900 font-medium">{internship.company}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Student:</span>
                        <span className="ml-2 text-gray-900 font-medium">{internship.student}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Supervisor:</span>
                        <span className="ml-2 text-gray-900">{internship.supervisor}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-2 text-gray-900">{internship.startDate} to {internship.endDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal('edit-internship', internship)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem('internship', internship.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Admissions 2026 Campaign Tab */}
        {activeTab === 'admissions' && (
          <div className="space-y-6">
            {/* Key Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium opacity-90">Total Applicants</h3>
                  <Users className="w-5 h-5 opacity-75" />
                </div>
                <div className="text-3xl font-bold mb-1">{admissions.totalApplicants}</div>
                <div className="text-sm opacity-90">
                  Target: {admissions.targetApplicants} ({Math.round(admissions.totalApplicants / admissions.targetApplicants * 100)}%)
                </div>
                <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${Math.min(admissions.totalApplicants / admissions.targetApplicants * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium opacity-90">Accepted Students</h3>
                  <Check className="w-5 h-5 opacity-75" />
                </div>
                <div className="text-3xl font-bold mb-1">{admissions.acceptedStudents}</div>
                <div className="text-sm opacity-90">
                  Target: {admissions.targetAcceptance} ({Math.round(admissions.acceptedStudents / admissions.targetAcceptance * 100)}%)
                </div>
                <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${Math.min(admissions.acceptedStudents / admissions.targetAcceptance * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium opacity-90">Confirmed Enrollments</h3>
                  <Award className="w-5 h-5 opacity-75" />
                </div>
                <div className="text-3xl font-bold mb-1">{admissions.confirmedEnrollments}</div>
                <div className="text-sm opacity-90">
                  Target: {admissions.targetEnrollments} ({Math.round(admissions.confirmedEnrollments / admissions.targetEnrollments * 100)}%)
                </div>
                <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${Math.min(admissions.confirmedEnrollments / admissions.targetEnrollments * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Campaigns Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Marketing Campaigns
                </h2>
                <button
                  onClick={() => openModal('add-campaign')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Campaign
                </button>
              </div>

              <div className="space-y-4">
                {filteredCampaigns.map(campaign => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{campaign.platform}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('edit-campaign', campaign)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteItem('campaign', campaign.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Budget</div>
                        <div className="text-sm font-semibold text-gray-900">${campaign.budget.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Spent</div>
                        <div className="text-sm font-semibold text-gray-900">${campaign.spent.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Leads Generated</div>
                        <div className="text-sm font-semibold text-indigo-600">{campaign.leads}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Cost per Lead</div>
                        <div className="text-sm font-semibold text-gray-900">${campaign.leads ? Math.round(campaign.spent / campaign.leads) : 0}</div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Budget Usage</span>
                        <span>{Math.round(campaign.spent / campaign.budget * 100)}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 rounded-full h-2 transition-all"
                          style={{ width: `${Math.min(campaign.spent / campaign.budget * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500"> Started on {campaign.startDate}, ends on {campaign.endDate}</div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => openModal('edit-campaign', campaign)}
                        className="px-3 py-1 text-sm bg-gray-100 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem('campaign', campaign.id)}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  Campaign Milestones
                </h2>
                <button
                  onClick={() => openModal('add-milestone')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Milestone
                </button>
              </div>

              <div className="space-y-3">
                {admissions.milestones.map(milestone => (
                  <div 
                    key={milestone.id} 
                    className={`border rounded-lg p-4 flex items-center justify-between ${
                      milestone.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleMilestone(milestone.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          milestone.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300 hover:border-indigo-500'
                        }`}
                      >
                        {milestone.completed && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <div>
                        <h3 className={`font-medium ${milestone.completed ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                          {milestone.title}
                        </h3>
                        <p className="text-sm text-gray-600">Target Date: {milestone.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal('edit-milestone', milestone)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem('milestone', milestone.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType.includes('add') ? 'Add New' : 'Edit'} {modalType.includes('event') ? 'Event' : modalType.includes('communication') ? 'Announcement' : modalType.includes('campaign') ? 'Campaign' : modalType.includes('milestone') ? 'Milestone' : 'Internship'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {/* Event Form */}
              {modalType.includes('event') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={formData.date || ''}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={formData.time || ''}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                      <input
                        type="text"
                        value={formData.organizer || ''}
                        onChange={(e) => setFormData({...formData, organizer: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Academic">Academic</option>
                        <option value="Professional Development">Professional Development</option>
                        <option value="Student Affairs">Student Affairs</option>
                        <option value="Social">Social</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Communication Form */}
              {modalType.includes('communication') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea
                      value={formData.content || ''}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                      <input
                        type="text"
                        value={formData.author || ''}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Academic">Academic</option>
                        <option value="Research">Research</option>
                        <option value="Operations">Operations</option>
                        <option value="HR">HR</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={formData.priority || ''}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select priority</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Internship Form */}
              {modalType.includes('internship') && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={formData.company || ''}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <input
                        type="text"
                        value={formData.position || ''}
                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                      <input
                        type="text"
                        value={formData.student || ''}
                        onChange={(e) => setFormData({...formData, student: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
                      <input
                        type="text"
                        value={formData.supervisor || ''}
                        onChange={(e) => setFormData({...formData, supervisor: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate || ''}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status || ''}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select status</option>
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Campaign Form */}
              {modalType.includes('campaign') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                    <input
                      type="text"
                      value={formData.platform || ''}
                      onChange={(e) => setFormData({...formData, platform: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Instagram/LinkedIn, Email Marketing"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
                      <input
                        type="number"
                        value={formData.budget || ''}
                        onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Spent ($)</label>
                      <input
                        type="number"
                        value={formData.spent || ''}
                        onChange={(e) => setFormData({...formData, spent: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Leads</label>
                      <input
                        type="number"
                        value={formData.leads || ''}
                        onChange={(e) => setFormData({...formData, leads: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate || ''}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status || ''}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Milestone Form */}
              {modalType.includes('milestone') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Milestone Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                    <input
                      type="date"
                      value={formData.date || ''}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {modalType.includes('add') ? 'Add' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
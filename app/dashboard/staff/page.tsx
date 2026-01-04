'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/app/components/staff/Header';
import NavigationTabs from '@/app/components/staff/NavigationTabs';
import FormModal from '@/app/components/staff/FormModal';
import EventsTab from '@/app/components/staff/EventsTab';
import EventsCalendarTab from '@/app/components/staff/EventsCalendarTab';
import CommunicationsTab from '@/app/components/staff/CommunicationsTab';
import InternshipsTab from '@/app/components/staff/InternshipsTab';
import AdmissionsTab from '@/app/components/staff/AdmissionsTab';

/* =====================
   Type definitions
===================== */

type EventItem = {
  id?: number;
  title: string;
  date: string;
  time?: string;
  category?: string;
  location?: string;
  organizer?: string;
  startDate?: string;
  endDate?: string;
  eventType?: string;
};

type Communication = {
  id?: number;
  title: string;
  content: string;
  author?: string;
  priority?: string;
  category?: string;
  date: string;
};

type Internship = {
  id?: number;
  position: string;
  company: string;
  student: string;
  supervisor?: string;
  start_date?: string;
  end_date?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
};

type Campaign = {
  id?: number;
  name: string;
  platform: string;
  budget: number;
  spent: number;
  leads: number;
  start_date?: string;
  startDate?: string;
};

type Milestone = {
  id?: number;
  title: string;
  due_date?: string;
  dueDate?: string;
  is_completed?: boolean;
  completed?: boolean;
};

type AdmissionsMetric = Record<string, any>;

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState<string>('events');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('event');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, any>>({});

  /* =====================
     Typed state
  ===================== */

  const [events, setEvents] = useState<EventItem[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [admissionsMetrics, setAdmissionsMetrics] = useState<AdmissionsMetric[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      const [
        eventsData,
        commsData,
        internshipsData,
        campaignsData,
        milestonesData,
        admissionsData
      ] = await Promise.all([
        supabase.from('events').select('*').order('date', { ascending: false }),
        supabase.from('communications').select('*').order('date', { ascending: false }),
        supabase.from('internships').select('*').order('start_date', { ascending: false }),
        supabase.from('campaigns').select('*').order('start_date', { ascending: false }),
        supabase.from('milestones').select('*').order('due_date', { ascending: true }),
        supabase.from('admissions_metrics').select('*')
      ]);

      if (eventsData.data) setEvents(mapEvents(eventsData.data));
      if (commsData.data) setCommunications(commsData.data as Communication[]);
      if (internshipsData.data) setInternships(mapInternships(internshipsData.data));
      if (campaignsData.data) setCampaigns(mapCampaigns(campaignsData.data));
      if (milestonesData.data) setMilestones(mapMilestones(milestonesData.data));
      if (admissionsData.data) setAdmissionsMetrics(admissionsData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  /* =====================
     Mapping helpers
  ===================== */

  const mapEvents = (data: EventItem[]): EventItem[] =>
    data.map(e => ({
      ...e,
      startDate: e.date,
      endDate: e.date,
      eventType: e.category,
      time: e.time
    }));

  const mapInternships = (data: Internship[]): Internship[] =>
    data.map(i => ({
      ...i,
      startDate: i.start_date,
      endDate: i.end_date
    }));

  const mapCampaigns = (data: Campaign[]): Campaign[] =>
    data.map(c => ({
      ...c,
      startDate: c.start_date
    }));

  const mapMilestones = (data: Milestone[]): Milestone[] =>
    data.map(m => ({
      ...m,
      dueDate: m.due_date,
      completed: m.is_completed
    }));

  /* =====================
     Modal handlers
  ===================== */

  const openAddModal = (type: string) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
  };

  const openEditModal = (type: string, item: any) => {
    setModalType(type);
    setFormData(item);
    setShowModal(true);
  };

  /* =====================
     Delete + toggle
  ===================== */

  const handleDelete = async (id: number, type: string) => {
    const tables: Record<string, string> = {
      event: 'events',
      communication: 'communications',
      internship: 'internships',
      campaign: 'campaigns',
      milestone: 'milestones'
    };

    const { error } = await supabase.from(tables[type]).delete().eq('id', id);
    if (error) return alert('Delete failed');

    if (type === 'event') setEvents(events.filter(e => e.id !== id));
    if (type === 'communication') setCommunications(communications.filter(c => c.id !== id));
    if (type === 'internship') setInternships(internships.filter(i => i.id !== id));
    if (type === 'campaign') setCampaigns(campaigns.filter(c => c.id !== id));
    if (type === 'milestone') setMilestones(milestones.filter(m => m.id !== id));
  };

  const handleToggleMilestone = async (id: number, completed: boolean) => {
    const { error } = await supabase
      .from('milestones')
      .update({ is_completed: completed })
      .eq('id', id);

    if (error) return alert('Update failed');

    setMilestones(milestones.map(m => m.id === id ? { ...m, completed } : m));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          {activeTab === 'events' && (
            <EventsTab
              events={events}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onEdit={e => openEditModal('event', e)}
              onDelete={id => handleDelete(id, 'event')}
              onAdd={() => openAddModal('event')}
            />
          )}

          {activeTab === 'events-calendar' && (
            <EventsCalendarTab
              events={events}
              onEdit={e => openEditModal('event', e)}
              onDelete={id => handleDelete(id, 'event')}
              onAdd={() => openAddModal('event')}
            />
          )}

          {activeTab === 'communications' && (
            <CommunicationsTab
              communications={communications}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onEdit={c => openEditModal('communication', c)}
              onDelete={id => handleDelete(id, 'communication')}
              onAdd={() => openAddModal('communication')}
            />
          )}

          {activeTab === 'internships' && (
            <InternshipsTab
              internships={internships}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onEdit={i => openEditModal('internship', i)}
              onDelete={id => handleDelete(id, 'internship')}
              onAdd={() => openAddModal('internship')}
            />
          )}

          {activeTab === 'admissions' && (
            <AdmissionsTab
              admissionsMetrics={admissionsMetrics}
              campaigns={campaigns}
              milestones={milestones}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onEditCampaign={c => openEditModal('campaign', c)}
              onDeleteCampaign={id => handleDelete(id, 'campaign')}
              onAddCampaign={() => openAddModal('campaign')}
              onEditMilestone={m => openEditModal('milestone', m)}
              onDeleteMilestone={id => handleDelete(id, 'milestone')}
              onAddMilestone={() => openAddModal('milestone')}
              onToggleMilestone={handleToggleMilestone}
            />
          )}
        </div>
      </main>

      <FormModal
        isOpen={showModal}
        modalType={modalType}
        formData={formData}
        onClose={() => setShowModal(false)}
        onSubmit={() => {}}
      />
    </div>
  );
}

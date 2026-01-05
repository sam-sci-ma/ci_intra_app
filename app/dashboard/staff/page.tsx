'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/components/staff/Header';
import NavigationTabs from '@/app/components/staff/NavigationTabs';
import FormModal from '@/app/components/staff/FormModal';
import EventsTab from '@/app/components/staff/EventsTab';
import EventsCalendarTab from '@/app/components/staff/EventsCalendarTab';
import CommunicationsTab from '@/app/components/staff/CommunicationsTab';
import InternshipsTab from '@/app/components/staff/InternshipsTab';
import AdmissionsTab from '@/app/components/staff/AdmissionsTab';
import SuperAdminsTab from '@/app/components/staff/SuperAdminsTab';

/* =====================
   Types
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
  eventType?: string;
  attendees?: number;
  created_by?: string;
  owner_name?: string;
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
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('events');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('event');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});

  const [events, setEvents] = useState<EventItem[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [admissionsMetrics, setAdmissionsMetrics] = useState<AdmissionsMetric[]>([]);

  /* =====================
     Load data
  ===================== */

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    const [
      eventsRes,
      commsRes,
      internshipsRes,
      campaignsRes,
      milestonesRes,
      admissionsRes
    ] = await Promise.all([
      supabase
        .from('events')
        .select(`*, staff_profiles ( full_name )`)
        .order('date', { ascending: false }),
      supabase.from('communications').select('*').order('date', { ascending: false }),
      supabase.from('internships').select('*').order('start_date', { ascending: false }),
      supabase.from('campaigns').select('*').order('start_date', { ascending: false }),
      supabase.from('milestones').select('*').order('due_date'),
      supabase.from('admissions_metrics').select('*')
    ]);

    console.log('Events Response:', eventsRes);
    if (eventsRes.error) console.error('Events Error:', eventsRes.error);
    
    if (eventsRes.data) {
      console.log('Events Data:', eventsRes.data);
      setEvents(mapEvents(eventsRes.data));
    }
    if (commsRes.data) setCommunications(commsRes.data as Communication[]);
    if (internshipsRes.data) setInternships(mapInternships(internshipsRes.data));
    if (campaignsRes.data) setCampaigns(mapCampaigns(campaignsRes.data));
    if (milestonesRes.data) setMilestones(mapMilestones(milestonesRes.data));
    if (admissionsRes.data) setAdmissionsMetrics(admissionsRes.data);
  }

  /* =====================
     Mappers
  ===================== */

  const mapEvents = (data: any[]) =>
    data.map(e => ({
      ...e,
      startDate: e.date,
      eventType: e.category,
      owner_name: e.staff_profiles?.full_name || (e.created_by ? 'Unknown' : 'System Admin')
    }));

  const mapInternships = (data: Internship[]) =>
    data.map(i => ({
      ...i,
      startDate: i.start_date,
      endDate: i.end_date
    }));

  const mapCampaigns = (data: Campaign[]) =>
    data.map(c => ({
      ...c,
      startDate: c.start_date
    }));

  const mapMilestones = (data: Milestone[]) =>
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
     Submit handler
  ===================== */

  const handleSubmit = async (data: Record<string, any>) => {
    const tables: Record<string, string> = {
      event: 'events',
      communication: 'communications',
      internship: 'internships',
      campaign: 'campaigns',
      milestone: 'milestones'
    };

    const table = tables[modalType];
    if (!table) return alert('Unknown form type');

    let dbData: any;

    if (modalType === 'event') {
      dbData = {
        title: data.title,
        date: data.startDate ?? data.date,
        time: data.time,
        location: data.location,
        organizer: data.organizer,
        attendees: Number(data.attendees) || 0,
        category: data.eventType ?? data.category,
        created_by: user?.id
      };
    } else if (modalType === 'communication') {
      dbData = {
        title: data.title,
        content: data.content,
        author: data.author,
        category: data.category,
        priority: data.priority,
        date: data.date
      };
    } else if (modalType === 'internship') {
      dbData = {
        position: data.position,
        company: data.company,
        student: data.student,
        supervisor: data.supervisor,
        start_date: data.startDate,
        end_date: data.endDate,
        status: data.status
      };
    } else if (modalType === 'campaign') {
      dbData = {
        name: data.name,
        platform: data.platform,
        budget: data.budget,
        spent: data.spent,
        leads: data.leads,
        start_date: data.startDate
      };
    } else {
      dbData = {
        title: data.title,
        due_date: data.dueDate,
        is_completed: data.completed
      };
    }

    if (data.id) {
      const { error: updateError } = await supabase
        .from(table)
        .update(dbData)
        .eq('id', data.id);

      if (updateError) {
        console.error('Update Error:', updateError);
        return alert(updateError.message);
      }
      console.log('Update successful');
    } else {
      console.log('Inserting into:', table, 'Data:', dbData);
      const { data: insertedData, error: insertError } = await supabase
        .from(table)
        .insert(dbData)
        .select();

      if (insertError) {
        console.error('Insert Error:', insertError);
        return alert(insertError.message);
      }
      console.log('Insert successful, inserted data:', insertedData);
    }

    await loadAllData();
    setShowModal(false);
  };

  /* =====================
     Delete and toggle
  ===================== */

  const handleDelete = async (id: number, type: string) => {
    const tables: Record<string, string> = {
      event: 'events',
      communication: 'communications',
      internship: 'internships',
      campaign: 'campaigns',
      milestone: 'milestones'
    };

    await supabase.from(tables[type]).delete().eq('id', id);
    loadAllData();
  };

  const handleToggleMilestone = async (id: number, completed: boolean) => {
    await supabase
      .from('milestones')
      .update({ is_completed: completed })
      .eq('id', id);

    loadAllData();
  };

  /* =====================
     Render
  ===================== */

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

          {activeTab === 'superadmins' && <SuperAdminsTab />}
        </div>
      </main>

      <FormModal
        isOpen={showModal}
        modalType={modalType}
        formData={formData}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

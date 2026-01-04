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

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('events');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('event');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({});

  // State for all data
  const [events, setEvents] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [internships, setInternships] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [admissionsMetrics, setAdmissionsMetrics] = useState([]);

  // Load data from Supabase
  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      // Fetch all data in parallel
      const [eventsData, commsData, internshipsData, campaignsData, milestonesData, admissionsData] = await Promise.all([
        supabase.from('events').select('*').order('date', { ascending: false }),
        supabase.from('communications').select('*').order('date', { ascending: false }),
        supabase.from('internships').select('*').order('start_date', { ascending: false }),
        supabase.from('campaigns').select('*').order('start_date', { ascending: false }),
        supabase.from('milestones').select('*').order('due_date', { ascending: true }),
        supabase.from('admissions_metrics').select('*')
      ]);

      if (eventsData.data) setEvents(mapEvents(eventsData.data));
      if (commsData.data) setCommunications(mapCommunications(commsData.data));
      if (internshipsData.data) setInternships(mapInternships(internshipsData.data));
      if (campaignsData.data) setCampaigns(mapCampaigns(campaignsData.data));
      if (milestonesData.data) setMilestones(mapMilestones(milestonesData.data));
      if (admissionsData.data) setAdmissionsMetrics(admissionsData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  // Field mapping functions (snake_case to camelCase)
  const mapEvents = (data: any[]) => data.map(e => ({
    ...e,
    startDate: e.date,
    endDate: e.date,
    eventType: e.category,
    time: e.time
  }));

  const mapCommunications = (data: any[]) => data;
  const mapInternships = (data: any[]) => data.map(i => ({
    ...i,
    startDate: i.start_date,
    endDate: i.end_date
  }));
  const mapCampaigns = (data: any[]) => data.map(c => ({
    ...c,
    startDate: c.start_date
  }));
  const mapMilestones = (data: any[]) => data.map(m => ({
    ...m,
    dueDate: m.due_date,
    completed: m.is_completed
  }));

  // Modal handlers
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

  // CRUD handlers
  const handleSubmit = async (data: any) => {
    try {
      console.log('Submitting form data:', { modalType, data });
      
      if (!data || Object.keys(data).length === 0) {
        alert('Please fill in the form fields');
        return;
      }

      // Map camelCase back to snake_case for database
      let dbData = { ...data };
      let table = '';

      if (modalType === 'event') {
        table = 'events';
        dbData = {
          title: data.title || '',
          date: data.startDate || new Date().toISOString().split('T')[0],
          time: data.time || '09:00:00',
          category: data.eventType || '',
          location: data.location || '',
          organizer: data.organizer || ''
        };

        if (data.id) {
          console.log('Updating event:', data.id, dbData);
          const { error } = await supabase.from(table).update(dbData).eq('id', data.id);
          if (error) {
            console.error('Supabase update error:', error);
            throw new Error(`Update failed: ${error.message}`);
          }
          setEvents(events.map(e => e.id === data.id ? { ...data, startDate: data.startDate, eventType: data.eventType } : e));
        } else {
          console.log('Inserting new event:', dbData);
          // Generate a new ID (max ID + 1)
          const maxId = events.length > 0 ? Math.max(...events.map(e => e.id || 0)) : 0;
          const newData = { ...dbData, id: maxId + 1 };
          const { data: newEvent, error } = await supabase.from(table).insert([newData]).select();
          if (error) {
            console.error('Supabase insert error:', error);
            throw new Error(`Insert failed: ${error.message}`);
          }
          if (newEvent) setEvents([mapEvents(newEvent)[0], ...events]);
        }
      } else if (modalType === 'communication') {
        table = 'communications';
        dbData = {
          title: data.title || '',
          content: data.content || '',
          author: data.author || '',
          priority: data.priority || 'medium',
          category: data.category || '',
          date: new Date().toISOString().split('T')[0]
        };

        if (data.id) {
          const { error } = await supabase.from(table).update(dbData).eq('id', data.id);
          if (error) throw new Error(`Update failed: ${error.message}`);
          setCommunications(communications.map(c => c.id === data.id ? data : c));
        } else {
          const maxId = communications.length > 0 ? Math.max(...communications.map(c => c.id || 0)) : 0;
          const newData = { ...dbData, id: maxId + 1 };
          const { data: newComm, error } = await supabase.from(table).insert([newData]).select();
          if (error) throw new Error(`Insert failed: ${error.message}`);
          if (newComm) setCommunications([newComm[0], ...communications]);
        }
      } else if (modalType === 'internship') {
        table = 'internships';
        dbData = {
          position: data.position || '',
          company: data.company || '',
          student: data.student || '',
          supervisor: data.supervisor || '',
          start_date: data.startDate || new Date().toISOString().split('T')[0],
          end_date: data.endDate || new Date().toISOString().split('T')[0],
          status: data.status || 'active'
        };

        if (data.id) {
          const { error } = await supabase.from(table).update(dbData).eq('id', data.id);
          if (error) throw new Error(`Update failed: ${error.message}`);
          setInternships(internships.map(i => i.id === data.id ? { ...data, startDate: data.startDate, endDate: data.endDate } : i));
        } else {
          const maxId = internships.length > 0 ? Math.max(...internships.map(i => i.id || 0)) : 0;
          const newData = { ...dbData, id: maxId + 1 };
          const { data: newInternship, error } = await supabase.from(table).insert([newData]).select();
          if (error) throw new Error(`Insert failed: ${error.message}`);
          if (newInternship) setInternships([mapInternships(newInternship)[0], ...internships]);
        }
      } else if (modalType === 'campaign') {
        table = 'campaigns';
        dbData = {
          name: data.name || '',
          platform: data.platform || '',
          budget: data.budget || 0,
          spent: data.spent || 0,
          leads: data.leads || 0,
          start_date: data.startDate || new Date().toISOString().split('T')[0]
        };

        if (data.id) {
          const { error } = await supabase.from(table).update(dbData).eq('id', data.id);
          if (error) throw new Error(`Update failed: ${error.message}`);
          setCampaigns(campaigns.map(c => c.id === data.id ? { ...data, startDate: data.startDate } : c));
        } else {
          const maxId = campaigns.length > 0 ? Math.max(...campaigns.map(c => c.id || 0)) : 0;
          const newData = { ...dbData, id: maxId + 1 };
          const { data: newCampaign, error } = await supabase.from(table).insert([newData]).select();
          if (error) throw new Error(`Insert failed: ${error.message}`);
          if (newCampaign) setCampaigns([mapCampaigns(newCampaign)[0], ...campaigns]);
        }
      } else if (modalType === 'milestone') {
        table = 'milestones';
        dbData = {
          title: data.title || '',
          due_date: data.dueDate || new Date().toISOString().split('T')[0],
          is_completed: data.completed || false
        };

        if (data.id) {
          const { error } = await supabase.from(table).update(dbData).eq('id', data.id);
          if (error) throw new Error(`Update failed: ${error.message}`);
          setMilestones(milestones.map(m => m.id === data.id ? { ...data, dueDate: data.dueDate, completed: data.completed } : m));
        } else {
          const maxId = milestones.length > 0 ? Math.max(...milestones.map(m => m.id || 0)) : 0;
          const newData = { ...dbData, id: maxId + 1 };
          const { data: newMilestone, error } = await supabase.from(table).insert([newData]).select();
          if (error) throw new Error(`Insert failed: ${error.message}`);
          if (newMilestone) setMilestones([mapMilestones(newMilestone)[0], ...milestones]);
        }
      } else {
        throw new Error(`Unknown form type: ${modalType}`);
      }

      console.log('Form submitted successfully');
      setShowModal(false);
      setFormData({});
    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : String(error) || 'Unknown error occurred';
      alert('Error saving data: ' + errorMessage);
    }
  };

  const handleDelete = async (id: number, type: string) => {
    try {
      const tables: Record<string, string> = {
        event: 'events',
        communication: 'communications',
        internship: 'internships',
        campaign: 'campaigns',
        milestone: 'milestones'
      };

      const { error } = await supabase.from(tables[type]).delete().eq('id', id);
      if (error) throw error;

      if (type === 'event') setEvents(events.filter(e => e.id !== id));
      else if (type === 'communication') setCommunications(communications.filter(c => c.id !== id));
      else if (type === 'internship') setInternships(internships.filter(i => i.id !== id));
      else if (type === 'campaign') setCampaigns(campaigns.filter(c => c.id !== id));
      else if (type === 'milestone') setMilestones(milestones.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    }
  };

  const handleToggleMilestone = async (id: number, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('milestones')
        .update({ is_completed: completed })
        .eq('id', id);

      if (error) throw error;
      setMilestones(milestones.map(m => m.id === id ? { ...m, completed } : m));
    } catch (error) {
      console.error('Error updating milestone:', error);
      alert('Error updating milestone. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'events' && (
            <EventsTab
              events={events}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onEdit={(event) => openEditModal('event', event)}
              onDelete={(id) => handleDelete(id, 'event')}
              onAdd={() => openAddModal('event')}
            />
          )}

          {activeTab === 'events-calendar' && (
            <EventsCalendarTab
              events={events}
              onEdit={(event) => openEditModal('event', event)}
              onDelete={(id) => handleDelete(id, 'event')}
              onAdd={() => openAddModal('event')}
            />
          )}

          {activeTab === 'communications' && (
            <CommunicationsTab
              communications={communications}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onEdit={(comm) => openEditModal('communication', comm)}
              onDelete={(id) => handleDelete(id, 'communication')}
              onAdd={() => openAddModal('communication')}
            />
          )}

          {activeTab === 'internships' && (
            <InternshipsTab
              internships={internships}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onEdit={(internship) => openEditModal('internship', internship)}
              onDelete={(id) => handleDelete(id, 'internship')}
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
              onEditCampaign={(campaign) => openEditModal('campaign', campaign)}
              onDeleteCampaign={(id) => handleDelete(id, 'campaign')}
              onAddCampaign={() => openAddModal('campaign')}
              onEditMilestone={(milestone) => openEditModal('milestone', milestone)}
              onDeleteMilestone={(id) => handleDelete(id, 'milestone')}
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
        onClose={() => {
          setShowModal(false);
          setFormData({});
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
import { supabase } from '@/lib/supabaseClient';

export function useCrudOperations() {
  const addEvent = async (data: any) => {
    const newEvent = { ...data, id: Date.now(), attendees: data.attendees || 0 };
    const { error } = await supabase.from('events').insert([newEvent]);
    if (error) throw error;
    return newEvent;
  };

  const updateEvent = async (data: any) => {
    const { error } = await supabase.from('events').update(data).eq('id', data.id);
    if (error) throw error;
    return data;
  };

  const deleteEvent = async (id: number) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  };

  const addCommunication = async (data: any) => {
    const newComm = { ...data, id: Date.now(), date: new Date().toISOString().split('T')[0] };
    const { error } = await supabase.from('communications').insert([newComm]);
    if (error) throw error;
    return newComm;
  };

  const updateCommunication = async (data: any) => {
    const { error } = await supabase.from('communications').update(data).eq('id', data.id);
    if (error) throw error;
    return data;
  };

  const deleteCommunication = async (id: number) => {
    const { error } = await supabase.from('communications').delete().eq('id', id);
    if (error) throw error;
  };

  const addInternship = async (data: any) => {
    const newInt = { ...data, id: Date.now() };
    const dbRecord = { ...newInt, start_date: newInt.startDate, end_date: newInt.endDate };
    const { error } = await supabase.from('internships').insert([dbRecord]);
    if (error) throw error;
    return newInt;
  };

  const updateInternship = async (data: any) => {
    const dbRecord = { ...data, start_date: data.startDate, end_date: data.endDate };
    const { error } = await supabase.from('internships').update(dbRecord).eq('id', data.id);
    if (error) throw error;
    return data;
  };

  const deleteInternship = async (id: number) => {
    const { error } = await supabase.from('internships').delete().eq('id', id);
    if (error) throw error;
  };

  const addCampaign = async (data: any) => {
    const newCamp = { ...data, id: Date.now() };
    const dbRecord = { ...newCamp, start_date: newCamp.startDate, end_date: newCamp.endDate };
    const { error } = await supabase.from('campaigns').insert([dbRecord]);
    if (error) throw error;
    return newCamp;
  };

  const updateCampaign = async (data: any) => {
    const dbRecord = { ...data, start_date: data.startDate, end_date: data.endDate };
    const { error } = await supabase.from('campaigns').update(dbRecord).eq('id', data.id);
    if (error) throw error;
    return data;
  };

  const deleteCampaign = async (id: number) => {
    const { error } = await supabase.from('campaigns').delete().eq('id', id);
    if (error) throw error;
  };

  const addMilestone = async (data: any) => {
    const newMile = { ...data, id: Date.now(), completed: false };
    const dbRecord = { ...newMile, target_date: newMile.date };
    const { error } = await supabase.from('milestones').insert([dbRecord]);
    if (error) throw error;
    return newMile;
  };

  const updateMilestone = async (data: any) => {
    const dbRecord = { ...data, target_date: data.date };
    const { error } = await supabase.from('milestones').update(dbRecord).eq('id', data.id);
    if (error) throw error;
    return data;
  };

  const deleteMilestone = async (id: number) => {
    const { error } = await supabase.from('milestones').delete().eq('id', id);
    if (error) throw error;
  };

  const toggleMilestoneCompletion = async (id: number, currentCompleted: boolean) => {
    const newCompleted = !currentCompleted;
    const { error } = await supabase.from('milestones').update({ completed: newCompleted }).eq('id', id);
    if (error) throw error;
    return newCompleted;
  };

  return {
    addEvent,
    updateEvent,
    deleteEvent,
    addCommunication,
    updateCommunication,
    deleteCommunication,
    addInternship,
    updateInternship,
    deleteInternship,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    toggleMilestoneCompletion
  };
}

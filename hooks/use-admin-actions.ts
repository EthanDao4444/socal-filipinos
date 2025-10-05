import { supabase } from '@/utils/supabase';

export const useAdminActions = () => {
  // 🟩 Add Event
  const addEvent = async (eventData: any) => {
    const { data, error } = await supabase.from('events').insert([eventData]);
    if (error) throw error;
    return data;
  };

  // 🟦 Update Event
  const updateEvent = async (event_id: string, updates: any) => {
    const { data, error } = await supabase.from('events').update(updates).eq('event_id', event_id);
    if (error) throw error;
    return data;
  };

  // 🟥 Remove Event
  const removeEvent = async (event_id: string) => {
    const { error } = await supabase.from('events').delete().eq('event_id', event_id);
    if (error) throw error;
  };

  // 🟩 Add Business
  const addBusiness = async (businessData: any) => {
    const { data, error } = await supabase.from('businesses').insert([businessData]);
    if (error) throw error;
    return data;
  };

  // 🟦 Update Business
  const updateBusiness = async (business_id: string, updates: any) => {
    const { data, error } = await supabase.from('businesses').update(updates).eq('business_id', business_id);
    if (error) throw error;
    return data;
  };

  // 🟥 Remove Business
  const removeBusiness = async (business_id: string) => {
    const { error } = await supabase.from('businesses').delete().eq('business_id', business_id);
    if (error) throw error;
  };

  return { addEvent, updateEvent, removeEvent, addBusiness, updateBusiness, removeBusiness };
};

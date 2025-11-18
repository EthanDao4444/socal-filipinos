import { supabase } from '@/utils/supabase';

// Fetches all events in database.
export async function fetchEvents() {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });
    if (error) {
        console.error('Error fetching events:', error.message);
        return [];
    } else {
        return data;
    }
}

// Adds the event with the provided event_id to user's saved list
export async function saveEvent(event_id: string) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert('Error: User not logged in.');
      return;
    }

    const { error } = await supabase.
        from('users_events').
        insert([{
            user_id: user.id,
            event_id: event_id
        }]);
    if (error) {
        throw error;
    }
    alert('Event saved!');
}
import { supabase } from '@/utils/supabase';

// Fetches all businesses in database.
export async function fetchBusinesses() {
    const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching businesses:', error.message);
        return [];
    } else {
        return data;
    }
}

// Adds the business with the provided business_id to user's saved list
export async function saveBusiness(business_id: string) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert('Error: User not logged in.');
      return;
    }

    const { error } = await supabase.
        from('users_businesses').
        insert([{
            user_id: user.id,
            business_id: business_id
        }]);
    if (error) {
        throw error;
    }
    alert('Business saved!');
}
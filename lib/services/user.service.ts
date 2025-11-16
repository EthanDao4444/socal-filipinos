import { supabase } from '@/utils/supabase';

export type UserRow = {
    user_id: string;
    full_name: string;
    avatar_url?: string | null;
    role?: string | null;
    created_at?: string | null;
    email?: string | null;
    user_location?: string | null;
    location_address?: string | null;
  };

  
export async function fetchUserById(userId : string): Promise<UserRow | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) throw error;
    return data;
}



export function fetchUserSettings() {
  
}

export async function deleteUserById(userId: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('user_id', userId);
  
    if (error) throw error;
  }

  export async function fetchCurrentUserRow(): Promise<UserRow | null> {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    const session = sessionData.session;
    if (!session?.user?.id) return null;
    return fetchUserById(session.user.id);
  }
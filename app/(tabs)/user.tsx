import { useEffect, useState } from 'react';
import { supabase} from '@/utils/supabase';
import { Text, View } from 'react-native';
import type { Session } from '@supabase/supabase-js';

interface User {
  first_name: string;
  last_name: string;
  avatar_url?: string;
}

export default function User() {
  const [session, setSession] = useState<Session | undefined | null>()
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {

    const fetchSession = async () => {
      setIsLoading(true)

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Error fetching session:', error)
      }

      setSession(session)
      setIsLoading(false)
    }

    fetchSession()
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(data);
      }
    };

    fetchUser();
    console.log("User fetched: ", user);
  }, [session]);

  return (
    <View>
      <Text style={{ color: 'blue' }}>a</Text>
    </View>
  );
}
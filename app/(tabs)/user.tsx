import { useEffect, useState } from 'react';
import { supabase} from '@/utils/supabase';
import { Text, View, Image } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import SignOutButton from '@/components/social-auth-buttons/sign-out-button';

interface User {
  full_name: string;
  created_at: string;
  avatar_url?: string;
  role: string;
  user_id: string;
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
    <View className="flex-1 bg-white">
    <View className="flex-1 flex-col justify-center items-center -mt-60">
      {user?.avatar_url ? (
        <Image
          source={{ uri: user.avatar_url }}
          className="w-44 h-44 rounded-full mb-4"
        />
      ) : (
        <Text>No Avatar</Text>
      )}
      <Text className="text-2xl font-semibold">
        {user?.full_name}
      </Text>
    </View>


    <View className="mb-10 px-6">
      <View className="border-t border-gray-300 mb-4" />
      <SignOutButton />
    </View>
  </View>
  );
}
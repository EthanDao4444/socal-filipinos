import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/utils/supabase';
import { Modal, View, Text, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import SignOutButton from '@/components/social-auth-buttons/sign-out-button';
import { Button } from '@/components/default/Button';
import SavedItemsModal from '@/components/SavedModal';
import { Ionicons } from '@expo/vector-icons';

interface User {
  full_name: string;
  created_at: string;
  avatar_url?: string;
  role: string;
  user_id: string;
}

export default function User() {
  const [session, setSession] = useState<Session | undefined | null>();
  const [user, setUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [events, setEvents] = useState<string[]>([]); // Replace string with your Event type
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedVisible, setSavedVisible] = useState(false);

  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        // TODO: or session doesn't exist
        // May be useful to implement this: https://dev.to/frontcodelover/securing-client-side-routes-in-nextjs-with-supabase-32n7
        console.error('Error fetching session:', error);
        // TODO: route back to login and immediately return
      }

      setSession(session);
      setIsLoading(false);
    };

    fetchSession();
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
    console.log('User fetched: ', user);
  }, [session]);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 flex-col items-center justify-center">
        {user?.avatar_url ? (
          <Image source={{ uri: user.avatar_url }} className="mb-4 h-40 w-40 rounded-full" />
        ) : (
          <Text>No Avatar</Text>
        )}
        <Text className="text-3xl font-semibold">{user?.full_name}</Text>
        <Button
          className="mt-4 w-1/4 rounded-lg bg-indigo-500 px-6 py-1 shadow-lg"
          textClassName="text-white text-xs"
          title="Edit Bio"
        />
        <Button
          className="mt-12 w-3/4 rounded-lg bg-white px-6 py-2 shadow-lg"
          title="User Settings"
        />
        <Button
          className="mt-12 w-3/4 rounded-lg bg-white px-6 py-2 shadow-lg"
          title="Saved Events/Businesses"
          onPress={() => setSavedVisible(true)}
        />
        <Button
          className="mt-12 w-3/4 rounded-lg bg-white px-6 py-2 shadow-lg"
          title="Friends List"
        />

        {/* MODALS */}
        <SavedItemsModal visible={savedVisible} onClose={() => setSavedVisible(false)} />
      </View>

      <View className="mb-10 items-center px-6">
        <View className="mb-4 w-5/6 border-t border-gray-300" />
        <SignOutButton className="mt-4 w-1/2" />
      </View>
    </View>
  );
}

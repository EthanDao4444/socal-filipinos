import { useEffect, useState, useRef} from 'react';
import { supabase} from '@/utils/supabase';
import { Modal, View, Text, TouchableOpacity, Animated, Dimensions, Image } from 'react-native'
import type { Session } from '@supabase/supabase-js';
import SignOutButton from '@/components/social-auth-buttons/sign-out-button';
import { Button } from '@/components/default/Button';

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
  const [modalVisible, setModalVisible] = useState(false)
  const [events, setEvents] = useState<string[]>([]) // Replace string with your Event type
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  const screenHeight = Dimensions.get('window').height

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

  const handleRegisteredEvents = () => {

    setModalVisible(true)
  }

  return (
    <View className="flex-1 bg-white">
    <View className="flex-1 flex-col justify-center items-center">
      {user?.avatar_url ? (
        <Image
          source={{ uri: user.avatar_url }}
          className="w-40 h-40 rounded-full mb-4"
        />
      ) : (
        <Text>No Avatar</Text>
      )}
      <Text className="text-3xl font-semibold">
        {user?.full_name}
      </Text>
      <Button
        className="w-1/4 bg-indigo-500 shadow-lg rounded-lg px-6 py-1 mt-4"
        textClassName="text-white text-xs"
        title="Edit Bio"
      />
      <Button className="w-3/4 bg-white shadow-lg rounded-lg px-6 py-2 mt-12" title="User Settings"/>
      <Button 
        className="w-3/4 bg-white shadow-lg rounded-lg px-6 py-2 mt-12" 
        title="Registered Events"
        onPress={handleRegisteredEvents}
      />
      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
      >
        {/* Touchable background to close modal */}
        <TouchableOpacity
          className="flex-1 bg-opacity-50"
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        />

        {/* Sliding modal content */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: screenHeight,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
            maxHeight: '50%',
          }}
        >
          <Text className="text-lg font-bold mb-4">Your Events</Text>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="bg-red-500 px-4 py-2 rounded-lg mt-4"
          >
            <Text className="text-white text-center font-semibold">Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
      <Button className="w-3/4 bg-white shadow-lg rounded-lg px-6 py-2 mt-12" title="Friends List"/>
    </View>

    <View className="mb-10 px-6 items-center">
      <View className="w-5/6 border-t border-gray-300 mb-4" />
      <SignOutButton className="w-1/2 mt-4"/>
    </View>

  </View>
  );
}
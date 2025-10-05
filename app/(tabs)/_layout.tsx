import { Tabs, Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import AdminModal from '@/components/admin/AdminModal';
import { supabase } from '@/utils/supabase';
import { useAuthContext } from '@/hooks/use-auth-context';

export default function TabLayout() {
  const { user } = useAuthContext();

  const MenuButton = ({ color = 'black' }) => {

    if (!user) return <Text>Please log in</Text>;

    const [modalVisible, setModalVisible] = useState(false);
    const role = user.role;

    if (role !== 'admin') return null; // Only show for admins

    return (
      <>
        <Pressable
          onPress={() => setModalVisible(true)}
          className="ml-4"
        >
          <Feather name="plus" size={32} color={color} />
        </Pressable>

        {/* Admin modal */}
        <AdminModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </>
    );
  };
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerLeft: ({ tintColor }) => <MenuButton />,
        headerTitle: () =>(
          <View className="flex-row items-center">
              <Image 
                source={require('../../assets/images/socal-filipinos-logo.jpg')} 
                className="w-14 h-14 rounded-2xl mr-4"
              />
              <Text className="font-adlam text-black text-2xl">Kababayan</Text>
          </View>
        ),
        headerStyle: {
          height: 120
        },
        tabBarStyle: {
          height: 100,
          borderTopWidth: 1.5,
          marginTop: 2,
          paddingTop: 16,
        }
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Feather size={28} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="celebrate"
          options={{
            title: 'Celebrate!',
            tabBarIcon: ({ color }) => <Feather size={28} name="star" color={color} />,
          }}  
        />
        <Tabs.Screen
          name="user"
          options={{
            title: 'User',
            tabBarIcon: ({ color }) => <Feather size={28} name="user" color={color} />,
          }}  
        />
    </Tabs>
  );
}

import { Tabs, Link } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  const HamburgerMenuButton = ({ color = 'black' }) => (
    <Pressable
      onPress={() => {
        console.log('Open Hamburger Menu/Drawer');
      }}
      className="ml-4"
    >
      <Feather name="menu" size={32} color={color} />
    </Pressable>
  );
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerLeft: ({ tintColor }) => <HamburgerMenuButton />,
        headerTitle: 'Kababayan',
        headerStyle: {
          height: 115
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Events',
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="businesses"
        options={{
          title: 'Businesses',
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Fil-Am History',
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}  
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'User',
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}  
      />
    </Tabs>
  );
}

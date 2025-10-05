import { Tabs, Link } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
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
        headerTitle: () =>(
          <View className="flex-row items-center space-x-3">
            <Image 
              source={require('../../assets/images/socal-filipinos-logo.jpg')} 
              className="w-14 h-14 rounded-2xl mr-4"
            />
            <Text className="font-adlam text-black text-2xl">Kababayan</Text>
          </View>
        ),
        headerStyle: {
          height: 120
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

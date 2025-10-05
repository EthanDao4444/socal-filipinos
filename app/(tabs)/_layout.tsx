import { Tabs, Link } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

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
          <View className="flex-row items-center">
              <Image 
                source={require('../../assets/images/socal-filipinos-logo.jpg')} 
                className="w-14 h-14 rounded-2xl mr-4"
              />
              <Text className="font-adlam text-black text-2xl">Kababayan</Text>
              <View>
                <Ionicons name="help-circle-outline" size={48} color="#757575" />
              </View>
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
        {/* <Tabs.Screen
          name="businesses"
          options={{
            title: 'Businesses',
            tabBarIcon: ({ color }) => <Feather size={28} name="briefcase" color={color} />,
          }}
        /> */}
        <Tabs.Screen
          name="games"
          options={{
            title: 'FAHM',
            tabBarIcon: ({ color }) => <Feather size={28} name="calendar" color={color} />,
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

import { useEffect, useState } from 'react';
import { supabase} from '@/utils/supabase';
import { Button, Text, View } from 'react-native';
import { Link, Stack } from 'expo-router';

interface User {
  first_name: string;
  last_name: string;
}

export default function CheckFighter() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex items-center p-8">
        <Text className="color-black font-adlam text-4xl">Check fighters!</Text>
      </View>
    </>
  );
}
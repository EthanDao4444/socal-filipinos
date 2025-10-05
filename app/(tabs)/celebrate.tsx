import { useEffect, useState } from 'react';
import { supabase} from '@/utils/supabase';
import { Button, Text, View } from 'react-native';
import { Link } from 'expo-router';

interface User {
  first_name: string;
  last_name: string;
}

export default function Celebrate() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async() => {
        const { data, error } = await supabase
          .from('users')
          .select();
        console.log(data);
    }

    // fetchUsers();
  }, [])
  return (
    <View className="flex items-center p-8">
      <Text className="color-black font-adlam text-4xl">LARO TAYO!</Text>
        <Link href="/games/home">
          <Text>Go to home screen!</Text>
        </Link>
    </View>
  );
}
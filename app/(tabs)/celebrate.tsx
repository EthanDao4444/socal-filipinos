import { useEffect, useState } from 'react';
import { supabase} from '@/utils/supabase';
import { Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/default/Button';

interface User {
  first_name: string;
  last_name: string;
}

export default function Celebrate() {
  const [users, setUsers] = useState<User[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async() => {
      const { data, error } = await supabase
        .from('users')
        .select();
      console.log(data);
    }

    // fetchUsers();
  }, [])

  const navigateToGames = () => {
    router.navigate('/games/home');
  }

  return (
    <View className="flex-col h-full justify-end items-center bg-blue-100 p-2">
      <Image className="h-[370px] w-[370px] p-8" source={require("../../assets/battle-jeepney.webp")}/>
      <View className="flex-1 px-10 items-center">
        <Text className="color-blue-900 font-adlam text-4xl text-center">Board the Barkada Jeepney!</Text>
        <Text className="color-blue-900 text-xl text-center p-4">Join Rocky the Kalabaw and co. as they travel throughout the Philippines to celebrate FAHM!</Text>
        <Button 
          className="w-1/2 bg-yellow-100 shadow-lg rounded-lg px-6 py-2" 
          title="PLAY"
          onPress={navigateToGames}
        />
      </View>
      
    </View>
  );
}
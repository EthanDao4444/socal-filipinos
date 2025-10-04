import { useEffect, useState } from 'react';
import { supabase} from '@/utils/supabase';
import { Text, View } from 'react-native';

interface User {
  first_name: string;
  last_name: string;
}

export default function User() {
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
    <View>
      <Text className="color: blue;">a</Text>
    </View>
  );
}
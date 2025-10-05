import { useEffect, useState } from 'react';
import { supabase} from '@/utils/supabase';
import { Text, View } from 'react-native';

import "../../global.css"

interface User {
  first_name: string;
  last_name: string;
}

export default function Businesses() {
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
      <Text className="font-adlam">a</Text>
    </View>
  );
}
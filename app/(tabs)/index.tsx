import { useEffect, useState } from 'react';
import { supabase} from '@/utils/supabase';
import { Text, View, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import "../../global.css"

interface User {
  first_name: string;
  last_name: string;
}

export default function Events() {
  const [users, setUsers] = useState<User[]>([]);

  const data = [
    {
      "name": "FV Cultural Festival",
      "location": "Fountain Valley, CA",
      "date": "Friday, August 14",
      "time": "5-8pm",
      "host": "FUSION",
      "attendees": 245,
      "price": "Free",
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwPHz8b-e_VUmF3M6Un6Rg-D1osZovxfMmJw&s",
      "contact": "ManILoveFilipinos@gmail.com",
      "description": "The cultural festival is back this year with more fun and immersive experiences! Experience the rich heritage, music, dances, food, performances, games, workshops, raffles, and more. Dress your best for this event!"
    },
    {
      "name": "FV Cultural Festival",
      "location": "Fountain Valley, CA",
      "date": "Friday, August 14",
      "time": "5-8pm",
      "host": "FUSION",
      "attendees": 245,
      "price": "Free",
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwPHz8b-e_VUmF3M6Un6Rg-D1osZovxfMmJw&s",
      "contact": "ManILoveFilipinos@gmail.com",
      "description": "The cultural festival is back this year with more fun and immersive experiences! Experience the rich heritage, music, dances, food, performances, games, workshops, raffles, and more. Dress your best for this event!"
    },
    {
      "name": "FV Cultural Festival",
      "location": "Fountain Valley, CA",
      "date": "Friday, August 14",
      "time": "5-8pm",
      "host": "FUSION",
      "attendees": 245,
      "price": "Free",
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwPHz8b-e_VUmF3M6Un6Rg-D1osZovxfMmJw&s",
      "contact": "ManILoveFilipinos@gmail.com",
      "description": "The cultural festival is back this year with more fun and immersive experiences! Experience the rich heritage, music, dances, food, performances, games, workshops, raffles, and more. Dress your best for this event!"
    },
    {
      "name": "FV Cultural Festival",
      "location": "Fountain Valley, CA",
      "date": "Friday, August 14",
      "time": "5-8pm",
      "host": "FUSION",
      "attendees": 245,
      "price": "Free",
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwPHz8b-e_VUmF3M6Un6Rg-D1osZovxfMmJw&s",
      "contact": "ManILoveFilipinos@gmail.com",
      "description": "The cultural festival is back this year with more fun and immersive experiences! Experience the rich heritage, music, dances, food, performances, games, workshops, raffles, and more. Dress your best for this event!"
    }
  ];

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
    <View className="flex-1 bg-white">
      <View className="justify-end h-[140px] border border-gray-400 p-5">
        <View className="flex-row justify-between">
          <Ionicons name="add" size={50}/>
          <Text className="text-3xl font-semibold">
            Kababayan
          </Text>
          <Ionicons name="map" size={50}/>
        </View>
      </View>
      <View className="flex-row h-[90px] justify-end border border-gray-400 p-5">
        <TextInput
          className="flex-1 border-gray-400 rounded-lg h-[50px] px-3 mr-2 bg-gray-300 text-base"
          placeholder="Search events, locations, organizers..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity>
          <Ionicons name="options" size={50} color="#808080"/>
        </TouchableOpacity>
      </View>
      <View className="flex-col h-[90px] p-5">
        <Text className="text-3xl font-semibold">
          Upcoming Events
        </Text>
        <Text className="text-xl">
          {data.length} events found
        </Text>
      </View>
      <ScrollView className="flex-1 bg-white p-5">
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row box-border h-40 bg-white shadow-lg rounded-lg mb-4">
            <Image
              source={{ uri: item.imageUrl }}
              className="w-2/5 rounded-lg"
            />
            <View className="flex-1 bg-white p-3 justify-between">
              <Text className="text-2xl font-semibold">
                {item.name}
              </Text>
              <View className="flex-row justify-start">
                <Ionicons name="location" size={15}/>
                <Text className="text-l px-1">
                  {item.location}
                </Text>
              </View>
              <View className="flex-row justify-start">
                <Ionicons name="calendar" size={15}/>
                <Text className="text-l px-1">
                  {item.date}, {item.time}
                </Text>
              </View>
              <View className="flex-row justify-start">
                <Ionicons name="people" size={15}/>
                <Text className="text-l px-1">
                  {item.host}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
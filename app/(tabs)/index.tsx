import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Text, View, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import "../../global.css"

// You can keep this interface if you still plan to fetch users
interface User {
  first_name: string;
  last_name: string;
}

// Define a type for the active tab
type ActiveTab = 'Events' | 'Businesses';

export default function DiscoverScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('Events'); // State to manage the active tab

  const eventData = [
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
    // ... other event items
  ];

  // Sample data for the Businesses tab
  const businessData = [
    {
      "name": "Manila Eats",
      "location": "Garden Grove, CA",
      "category": "Restaurant",
      "rating": 4.5,
      "imageUrl": "https://s3-media0.fl.yelpcdn.com/bphoto/gJb5kcP5n3B4yY3r2a4R2Q/l.jpg",
      "description": "Authentic Filipino cuisine serving classic dishes like Adobo, Sinigang, and Lechon."
    },
    {
      "name": "The Barong Shop",
      "location": "Westminster, CA",
      "category": "Retail",
      "rating": 4.8,
      "imageUrl": "https://images.summitmedia-digital.com/spotph/images/2021/06/15/kultura-1623743516.jpg",
      "description": "Specializing in traditional Filipino formal wear, including Barong Tagalog and Filipiniana dresses."
    },
    // ... other business items
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select();
      console.log(data);
    }

    // fetchUsers();
  }, [])

  // Component for rendering an Event card
  const EventCard = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      className="flex-row box-border h-40 bg-white shadow-lg rounded-3xl mb-4">
      <Image
        source={{ uri: item.imageUrl }}
        className="w-2/5 rounded-l-lg"
      />
      <View className="flex-1 p-3 justify-between">
        <Text className="text-2xl font-semibold">
          {item.name}
        </Text>
        <View className="flex-row items-center">
          <Ionicons name="location" size={15} />
          <Text className="text-l px-1">
            {item.location}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="calendar" size={15} />
          <Text className="text-l px-1">
            {item.date}, {item.time}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="people" size={15} />
          <Text className="text-l px-1">
            {item.host}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Component for rendering a Business card
  const BusinessCard = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      className="flex-row box-border h-40 bg-white shadow-lg rounded-3xl mb-4">
      <Image
        source={{ uri: item.imageUrl }}
        className="w-2/5 rounded-l-lg"
      />
      <View className="flex-1 p-3 justify-between">
        <Text className="text-2xl font-semibold">
          {item.name}
        </Text>
        <View className="flex-row items-center">
          <Ionicons name="location" size={15} />
          <Text className="text-l px-1">
            {item.location}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="business" size={15} />
          <Text className="text-l px-1">
            {item.category}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="star" size={15} color="#FFD700" />
          <Text className="text-l px-1">
            {item.rating} Stars
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Search Bar and Filters */}
      <View className="flex-row h-[90px] justify-end border-b border-gray-200 p-5 items-center">
        <TextInput
          className="flex-1 border-gray-300 rounded-lg h-[50px] px-3 mr-2 bg-gray-200 text-base"
          placeholder="Search events, businesses..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity>
          <Ionicons name="options" size={50} color="#808080" />
        </TouchableOpacity>
      </View>

      {/* Tabs for Events and Businesses */}
      <View className="flex-row h-[60px]">
        <TouchableOpacity
          onPress={() => setActiveTab('Events')}
          className={`flex-1 justify-center items-center border-b-2 ${activeTab === 'Events' ? 'border-blue-500' : 'border-gray-200'}`}>
          <Text className={`text-xl font-semibold ${activeTab === 'Events' ? 'text-blue-700' : 'text-gray-600'}`}>
            Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('Businesses')}
          className={`flex-1 justify-center items-center border-b-2 ${activeTab === 'Businesses' ? 'border-blue-500' : 'border-gray-200'}`}>
          <Text className={`text-xl font-semibold ${activeTab === 'Businesses' ? 'text-blue-700' : 'text-gray-600'}`}>
            Businesses
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Content */}
      {activeTab === 'Events' ? (
        <>
          <View className="flex-col h-[90px] p-5">
            <Text className="text-3xl font-semibold font-actor">
              Upcoming Events
            </Text>
            <Text className="text-xl text-gray-400 font-actor">
              {eventData.length} events found
            </Text>
          </View>
          <ScrollView className="flex-1 bg-white p-5">
            {eventData.map((item, index) => (
              <EventCard item={item} index={index} key={`event-${index}`} />
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          <View className="flex-col h-[90px] p-5">
            <Text className="text-3xl font-semibold font-actor">
              Local Businesses
            </Text>
            <Text className="text-xl text-gray-400 font-actor">
              {businessData.length} businesses found
            </Text>
          </View>
          <ScrollView className="flex-1 bg-white p-5">
            {businessData.map((item, index) => (
              <BusinessCard item={item} index={index} key={`business-${index}`} />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}
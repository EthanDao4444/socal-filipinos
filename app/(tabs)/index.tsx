import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Text, View, ScrollView, TextInput, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import "../../global.css";

// ## 1. Define TypeScript Interfaces
// These interfaces match your Supabase table schemas for type safety.
interface Event {
  event_id: string;
  created_at: string;
  event_name: string;
  event_description: string | null;
  start_date: string;
  end_date: string;
  organizer_email: string | null;
  price: number | null;
  event_location: any; // Supabase geography type is complex, using 'any'
}

interface Business {
  business_id: string;
  created_at: string;
  business_name: string;
  business_type: string | null;
  location: any; // Supabase geography type
}

type ActiveTab = 'Events' | 'Businesses';

export default function DiscoverScreen() {
  // ## 2. State Management for Fetched Data
  // State variables to hold the data fetched from Supabase.
  const [events, setEvents] = useState<Event[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('Events');

  // ## 3. Data Fetching with useEffect
  // This hook runs once when the component mounts to fetch data.
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*'); // Select all columns

      if (error) {
        console.error('Error fetching events:', error);
      } else if (data) {
        setEvents(data);
      }
    };

    const fetchBusinesses = async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*'); // Select all columns

      if (error) {
        console.error('Error fetching businesses:', error);
      } else if (data) {
        setBusinesses(data);
      }
    };

    fetchEvents();
    fetchBusinesses();
  }, []);

  // Helper function to format timestamp into readable date and time
  const formatDateTime = (isoString: string) => {
    if (!isoString) return { date: 'TBD', time: '' };
    const dateObj = new Date(isoString);
    const date = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const time = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    return { date, time };
  };

  // ## 4. Updated Card Components
  // These components now map fields from the database to the UI.
  
  // Component for rendering an Event card with data from Supabase
  const EventCard = ({ item }: { item: Event }) => {
    const { date, time } = formatDateTime(item.start_date);
    // Use a placeholder image since the 'events' table doesn't have an image column
    const placeholderImageUrl = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2070&auto=format&fit=crop";

    return (
      <TouchableOpacity className="flex-row box-border h-40 bg-white shadow-lg rounded-3xl mb-4">
        <Image
          source={{ uri: placeholderImageUrl }}
          className="w-2/5 rounded-l-lg bg-gray-200"
        />
        <View className="flex-1 p-3 justify-between">
          <Text className="text-2xl font-semibold">{item.event_name}</Text>
          <View className="flex-row items-center">
            <Ionicons name="location" size={15} />
            {/* Displaying a generic message for the 'geography' type */}
            <Text className="text-l px-1">{item.event_location ? 'Location available' : 'Location TBD'}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="calendar" size={15} />
            <Text className="text-l px-1">{date}, {time}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="people" size={15} />
            <Text className="text-l px-1">{item.organizer_email || 'Organizer TBD'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Component for rendering a Business card with data from Supabase
  const BusinessCard = ({ item }: { item: Business }) => {
    // Use placeholders for image and rating, as they aren't in the 'businesses' table
    const placeholderImageUrl = "https://images.unsplash.com/photo-1528698827591-e19ccd7e23ec?q=80&w=2070&auto=format&fit=crop";
    const defaultRating = 4.5;

    return (
      <TouchableOpacity className="flex-row box-border h-40 bg-white shadow-lg rounded-3xl mb-4">
        <Image
          source={{ uri: placeholderImageUrl }}
          className="w-2/5 rounded-l-lg bg-gray-200"
        />
        <View className="flex-1 p-3 justify-between">
          <Text className="text-2xl font-semibold">{item.business_name}</Text>
          <View className="flex-row items-center">
            <Ionicons name="location" size={15} />
            <Text className="text-l px-1">{item.location ? 'Location available' : 'Location TBD'}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="business" size={15} />
            <Text className="text-l px-1">{item.business_type || 'General Business'}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="star" size={15} color="#FFD700" />
            <Text className="text-l px-1">{defaultRating} Stars</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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

      {/* ## 5. Dynamic Rendering
          This section now uses the state variables (`events`, `businesses`)
          to render the lists, and keys are based on unique database IDs.
      */}
      {activeTab === 'Events' ? (
        <>
          <View className="flex-col h-[90px] p-5">
            <Text className="text-3xl font-semibold font-actor">
              Upcoming Events
            </Text>
            <Text className="text-xl text-gray-400 font-actor">
              {events.length} events found
            </Text>
          </View>
          <ScrollView className="flex-1 bg-white p-5">
            {events.map((item) => (
              <EventCard item={item} key={item.event_id} />
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
              {businesses.length} businesses found
            </Text>
          </View>
          <ScrollView className="flex-1 bg-white p-5">
            {businesses.map((item) => (
              <BusinessCard item={item} key={item.business_id} />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}
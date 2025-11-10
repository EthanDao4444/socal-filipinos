import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import "../../global.css";
import { fetchEvents, saveEvent } from '@/lib/services/event.service';
import { fetchBusinesses, saveBusiness } from '@/lib/services/business.service';

interface Event {
  event_id: string;
  event_name: string;
  event_description: string | null;
  start_date: string;
  end_date: string;
  organizer_email: string | null;
  price: number | null;
  image_url: string | null;
  location_address: string | null;
}

interface Business {
  business_id: string;
  business_name: string;
  business_type: string | null;
  location_address: string | null;
  image_url: string | null;
}

export default function EventsAndBusinesses() {
  const [activeTab, setActiveTab] = useState<'events' | 'businesses'>('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Event | Business | null>(null);
  const [search, setSearch] = useState('');

  // Re-fetch events and businesses when active tab is switched (more caching?)
  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      if (activeTab === 'events') {
        const data = await fetchEvents();
        setEvents(data);
      } else {
        const data = await fetchBusinesses();
        setBusinesses(data);
      }
      setLoading(false);
    };
    fetch();
  }, [activeTab]);

  // 🔹 Filtered by search
  const filtered = (activeTab === 'events' ? events : businesses).filter((item) =>
    (activeTab === 'events'
      ? (item as Event).event_name?.toLowerCase()
      : (item as Business).business_name?.toLowerCase()
    ).includes(search.toLowerCase())
  );

  // 🔹 Save button handler
  const handleSave = async () => {
    if (!selectedItem) return;

    try {
      if (activeTab === 'events') {
        await saveEvent((selectedItem as any).event_id);
      } else {
        await saveBusiness((selectedItem as any).business_id);
      }
      setSelectedItem(null);
    } catch (err: any) {
      if (err.message.includes('duplicate key value')) {
        alert('Already saved.');
      } else {
        alert('Error saving: ' + err.message);
      }
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* 🔹 Search bar */}
      <View className="flex-row h-[90px] justify-end border-b border-gray-300 p-5">
        <TextInput
          className="flex-1 border border-gray-400 rounded-lg h-[50px] px-3 mr-2 bg-gray-200 text-base"
          placeholder={`Search ${activeTab === 'events' ? 'events' : 'businesses'}...`}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#888"
        />
        <TouchableOpacity>
          <Ionicons name="search" size={35} color="#666" />
        </TouchableOpacity>
      </View>

      {/* 🔹 Tabs */}
      <View className="flex-row justify-around border-b border-gray-300">
        <TouchableOpacity onPress={() => setActiveTab('events')} className="flex-1 py-3">
          <Text className={`text-center text-lg font-semibold ${activeTab === 'events' ? 'text-blue-600' : 'text-gray-500'}`}>
            Events
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('businesses')} className="flex-1 py-3">
          <Text className={`text-center text-lg font-semibold ${activeTab === 'businesses' ? 'text-blue-600' : 'text-gray-500'}`}>
            Businesses
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView className="flex-1 p-4">
          {filtered.map((item: any) => (
            <TouchableOpacity
              key={item.event_id || item.business_id}
              className="flex-row h-40 bg-white shadow-md rounded-lg mb-4"
              onPress={() => setSelectedItem(item)}
            >
              <Image
                source={{ uri: item.image_url || 'https://placehold.co/600x400' }}
                className="w-2/5 rounded-l-lg"
              />
              <View className="flex-1 p-3 justify-between">
                <Text className="text-xl font-semibold">
                  {activeTab === 'events' ? item.event_name : item.business_name}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="location" size={15} color="#555" />
                  <Text className="ml-1 text-gray-600">{item.location_address || 'N/A'}</Text>
                </View>
                {activeTab === 'events' ? (
                  <>
                    <View className="flex-row items-center">
                      <Ionicons name="calendar" size={15} color="#555" />
                      <Text className="ml-1 text-gray-600">
                        {new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text className="text-gray-600 text-sm">{item.organizer_email || ''}</Text>
                  </>
                ) : (
                  <Text className="text-gray-600 text-sm">{item.business_type || ''}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {filtered.length === 0 && (
            <Text className="text-center text-gray-500 mt-10">No {activeTab} found.</Text>
          )}
        </ScrollView>
      )}

      {/* 🔹 Modal for details */}
      <Modal visible={!!selectedItem} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          {selectedItem ? (
            <View className="bg-white w-11/12 rounded-2xl p-5 max-h-[90%]">
              <ScrollView>
                <Image
                  source={{ uri: selectedItem?.image_url || 'https://via.placeholder.com/150' }}
                  className="w-full h-48 rounded-lg mb-4"
                />

                <Text className="text-2xl font-bold mb-2">
                  {activeTab === 'events'
                    ? (selectedItem as any)?.event_name
                    : (selectedItem as any)?.business_name}
                </Text>

                {activeTab === 'events' ? (
                  <>
                    <Text className="text-gray-600 mb-1">
                      {(selectedItem as any)?.start_date
                        ? `${new Date((selectedItem as any).start_date).toLocaleString()} - ${new Date(
                            (selectedItem as any).end_date
                          ).toLocaleString()}`
                        : ''}
                    </Text>
                    <Text className="text-gray-600 mb-2">
                      {(selectedItem as any)?.location_address || ''}
                    </Text>
                    <Text className="text-base mb-3">
                      {(selectedItem as any)?.event_description || ''}
                    </Text>
                    <Text className="text-gray-500 mb-3">
                      Organizer: {(selectedItem as any)?.organizer_email || 'N/A'}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text className="text-gray-600 mb-2">
                      {(selectedItem as any)?.location_address || ''}
                    </Text>
                    <Text className="text-gray-500 mb-2">
                      Type: {(selectedItem as any)?.business_type || ''}
                    </Text>
                  </>
                )}
              </ScrollView>

              {/* Buttons */}
              <View className="flex-row justify-between mt-3">
                <TouchableOpacity
                  onPress={handleSave}
                  className="flex-1 bg-blue-600 py-2 rounded-lg mr-2"
                >
                  <Text className="text-white text-center font-semibold">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedItem(null)}
                  className="flex-1 bg-gray-300 py-2 rounded-lg"
                >
                  <Text className="text-center font-semibold">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="bg-white w-11/12 rounded-2xl p-5 items-center">
              <ActivityIndicator size="large" color="#000" />
              <Text className="mt-3 text-gray-600">Loading...</Text>
            </View>
          )}
        </View>
      </Modal>

    </View>
  );
}

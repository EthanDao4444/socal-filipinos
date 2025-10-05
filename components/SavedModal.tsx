import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import "../global.css";

interface Event {
  event_id: string;
  event_name: string;
  location_address: string | null;
  image_url: string | null;
}

interface Business {
  business_id: string;
  business_name: string;
  location_address: string | null;
  image_url: string | null;
}

interface SavedItemsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SavedItemsModal({ visible, onClose }: SavedItemsModalProps) {
  const [loading, setLoading] = useState(true);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [savedBusinesses, setSavedBusinesses] = useState<Business[]>([]);

  const fetchSavedItems = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch saved events
    const { data: savedEvts, error: evtErr } = await supabase
      .from('users_events')
      .select('event_id, events(*)')
      .eq('user_id', user.id);

    // Fetch saved businesses
    const { data: savedBiz, error: bizErr } = await supabase
      .from('users_businesses')
      .select('business_id, businesses(*)')
      .eq('user_id', user.id);

    if (evtErr || bizErr) console.error(evtErr || bizErr);

    setSavedEvents(savedEvts?.map((e: any) => e.events) || []);
    setSavedBusinesses(savedBiz?.map((b: any) => b.businesses) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (visible) fetchSavedItems();
  }, [visible]);

  const handleUnsave = async (type: 'event' | 'business', id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (type === 'event') {
      await supabase.from('users_events').delete().match({ user_id: user.id, event_id: id });
      setSavedEvents((prev) => prev.filter((e) => e.event_id !== id));
    } else {
      await supabase.from('users_businesses').delete().match({ user_id: user.id, business_id: id });
      setSavedBusinesses((prev) => prev.filter((b) => b.business_id !== id));
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white w-11/12 rounded-2xl p-5 max-h-[85%]">
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* 🔹 Saved Events */}
              <Text className="text-2xl font-bold mb-3 text-center">Saved Events</Text>
              {savedEvents.length > 0 ? (
                savedEvents.map((event) => (
                  <View
                    key={event.event_id}
                    className="flex-row items-center border-b border-gray-200 pb-2 mb-3"
                  >
                    <Image
                      source={{ uri: event.image_url || 'https://via.placeholder.com/100' }}
                      className="w-16 h-16 rounded-md mr-3"
                    />
                    <View className="flex-1">
                      <Text className="font-semibold text-lg">{event.event_name}</Text>
                      <Text className="text-gray-600 text-sm">{event.location_address}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleUnsave('event', event.event_id)}>
                      <Ionicons name="trash-outline" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text className="text-center text-gray-400 mb-5">No saved events.</Text>
              )}

              {/* 🔹 Saved Businesses */}
              <Text className="text-2xl font-bold mb-3 text-center mt-5">Saved Businesses</Text>
              {savedBusinesses.length > 0 ? (
                savedBusinesses.map((biz) => (
                  <View
                    key={biz.business_id}
                    className="flex-row items-center border-b border-gray-200 pb-2 mb-3"
                  >
                    <Image
                      source={{ uri: biz.image_url || 'https://via.placeholder.com/100' }}
                      className="w-16 h-16 rounded-md mr-3"
                    />
                    <View className="flex-1">
                      <Text className="font-semibold text-lg">{biz.business_name}</Text>
                      <Text className="text-gray-600 text-sm">{biz.location_address}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleUnsave('business', biz.business_id)}>
                      <Ionicons name="trash-outline" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text className="text-center text-gray-400">No saved businesses.</Text>
              )}
            </ScrollView>
          )}

          <TouchableOpacity
            onPress={onClose}
            className="mt-4 bg-red-400 py-2 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

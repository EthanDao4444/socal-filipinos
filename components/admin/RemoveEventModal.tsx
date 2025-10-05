import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '@/utils/supabase';

interface RemoveEventModalProps {
  visible: boolean;
  onClose: () => void;
}

interface Event {
  event_id: string;
  event_name: string;
  location_address?: string;
  start_date?: string;
}

export default function RemoveEventModal({ visible, onClose }: RemoveEventModalProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch events when opened
  useEffect(() => {
    if (visible) fetchEvents();
  }, [visible]);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('event_id, event_name, location_address, start_date')
      .order('start_date', { ascending: true });

    if (error) {
      Alert.alert('Error fetching events', error.message);
    } else if (data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const handleDelete = async (eventId: string, eventName: string) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to remove "${eventName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('events')
              .delete()
              .eq('event_id', eventId);

            if (error) {
              Alert.alert('Error', error.message);
            } else {
              Alert.alert('Success', `"${eventName}" removed.`);
              setEvents((prev) => prev.filter((e) => e.event_id !== eventId));
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-11/12 rounded-2xl p-5 max-h-[80%]">
          <Text className="text-xl font-bold text-center mb-4">Remove Event</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : events.length === 0 ? (
            <Text className="text-center text-gray-500">No events found.</Text>
          ) : (
            <ScrollView className="max-h-[70vh]">
              {events.map((event) => (
                <Pressable
                  key={event.event_id}
                  onPress={() => handleDelete(event.event_id, event.event_name)}
                  className="p-3 mb-2 border border-gray-300 rounded-lg bg-gray-100 active:bg-red-100"
                >
                  <Text className="text-base font-semibold">{event.event_name}</Text>
                  {event.location_address ? (
                    <Text className="text-gray-500 text-sm">
                      {event.location_address}
                    </Text>
                  ) : null}
                  {event.start_date ? (
                    <Text className="text-gray-400 text-xs">
                      {new Date(event.start_date).toLocaleDateString()}
                    </Text>
                  ) : null}
                </Pressable>
              ))}
            </ScrollView>
          )}

          <Pressable
            onPress={onClose}
            className="mt-4 bg-gray-300 rounded-md py-2"
          >
            <Text className="text-center font-semibold">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

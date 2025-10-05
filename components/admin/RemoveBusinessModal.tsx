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

interface RemoveBusinessModalProps {
  visible: boolean;
  onClose: () => void;
}

interface Business {
  business_id: string;
  business_name: string;
  location_address?: string;
}

export default function RemoveBusinessModal({ visible, onClose }: RemoveBusinessModalProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch events when opened
  useEffect(() => {
    if (visible) fetchBusinesses();
  }, [visible]);

  const fetchBusinesses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('businesses')
      .select('business_id, business_name, location_address');

    if (error) {
      Alert.alert('Error fetching businesses', error.message);
    } else if (data) {
      setBusinesses(data);
    }
    setLoading(false);
  };

  const handleDelete = async (businessId: string, businessName: string) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to remove "${businessName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('businesses')
              .delete()
              .eq('business_id', businessId);

            if (error) {
              Alert.alert('Error', error.message);
            } else {
              Alert.alert('Success', `"${businessName}" removed.`);
              setBusinesses((prev) => prev.filter((e) => e.business_id !== businessId));
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
          <Text className="text-xl font-bold text-center mb-4">Remove Business</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : businesses.length === 0 ? (
            <Text className="text-center text-gray-500">No businesses found.</Text>
          ) : (
            <ScrollView className="max-h-[70vh]">
              {businesses.map((business) => (
                <Pressable
                  key={business.business_id}
                  onPress={() => handleDelete(business.business_id, business.business_name)}
                  className="p-3 mb-2 border border-gray-300 rounded-lg bg-gray-100 active:bg-red-100"
                >
                  <Text className="text-base font-semibold">{business.business_name}</Text>
                  {business.location_address ? (
                    <Text className="text-gray-500 text-sm">
                      {business.location_address}
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

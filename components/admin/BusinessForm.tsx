import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { supabase } from '@/utils/supabase';

interface BusinessFormProps {
  visible: boolean;
  onClose: () => void;
  existingBusiness?: any;
}

export default function BusinessForm({ visible, onClose, existingBusiness }: BusinessFormProps) {
  const [form, setForm] = useState({
    business_name: existingBusiness?.business_name ?? '',
    business_type: existingBusiness?.business_type ?? '',
    image_url: existingBusiness?.image_url ?? '',
    location_address: existingBusiness?.location_address ?? '',
    location: existingBusiness?.location ?? {
      latitude: 34.0522,
      longitude: -118.2437, // Default LA
    },
  });
  const mapRef = useRef<MapView | null>(null);

  // --- Reverse Geocode using Nominatim (OpenStreetMap) ---
  const fetchCityName = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      const city =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        '';
      const state = data.address.state;
      return `${city}, ${state}`;
    } catch (error) {
      console.error('Error fetching city:', error);
      return '';
    }
  };

  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const city = await fetchCityName(latitude, longitude);
    setForm((prev) => ({
      ...prev,
      location: { latitude, longitude },
      location_address: city,
    }));
  };

  const handleSubmit = async () => {
    const {
      business_name,
      business_type,
      image_url,
      location_address,
      location,
    } = form;

    if (!business_name || !location) {
      Alert.alert('Error', 'Please enter all required fields.');
      return;
    }

    const point = `POINT(${location.longitude} ${location.latitude})`;
    const payload = {
      business_name,
      business_type,
      image_url,
      location_address,
      location: point,
    };

    const { error } = existingBusiness
      ? await supabase.from('businesses').update(payload).eq('business_id', existingBusiness.id)
      : await supabase.from('businesses').insert([payload]);

    if (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', existingBusiness ? 'Business updated' : 'Business added');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/50">
        <ScrollView className="bg-white w-11/12 rounded-2xl p-5 max-h-[90%]">
          <Text className="text-xl font-bold text-center mb-4">
            {existingBusiness ? 'Edit Business' : 'Add Business'}
          </Text>

          {/* Inputs */}
          <TextInput
            placeholder="Business Name"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2"
            value={form.business_name}
            onChangeText={(val) => setForm({ ...form, business_name: val })}
          />
          <TextInput
            placeholder="Business Type"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2"
            value={form.business_type}
            onChangeText={(val) => setForm({ ...form, business_type: val })}
          />
          <TextInput
            placeholder="Image URL"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2"
            value={form.image_url}
            onChangeText={(val) => setForm({ ...form, image_url: val })}
          />
          {/* City info */}
          {form.location_address ? (
            <Text className="text-gray-700 mb-2">
              City: <Text className="font-semibold">{form.location_address}</Text>
            </Text>
          ) : null}

          {/* Map Picker */}
          <View className="mt-3 mb-3 h-64 rounded-xl overflow-hidden">
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: form.location.latitude,
                longitude: form.location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              onPress={handleMapPress}
            >
              <Marker
                coordinate={form.location}
                draggable
                onDragEnd={(e) => handleMapPress(e)}
              />
            </MapView>
          </View>

          <Pressable onPress={handleSubmit} className="bg-blue-600 rounded-md py-2 mt-3">
            <Text className="text-center text-white font-semibold">
              {existingBusiness ? 'Update Business' : 'Save Business'}
            </Text>
          </Pressable>
          <Pressable onPress={onClose} className="bg-gray-300 rounded-md py-2 mt-2">
            <Text className="text-center font-semibold">Cancel</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

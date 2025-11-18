import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '@/utils/supabase';

// - rateLimitedFetchReverseGeocode function: makes geolocation call to Nominatim
//    while enforcing a client-side rate limit and accepts an optional
//    AbortSignal to cancel wait/fetch.
import {
  rateLimitedFetchReverseGeocode,
  parseNominatimAddress,
  formatCityState,
  validateCoordinates,
  toPostgresPoint,
} from '@/lib/services/openstreetmap.service';

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
  // Holds the currently active reverse-geocode
  // request. When a new map press occurs abort the previous request
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    // Abort any previous call — Ensures only one request at a time
    abortRef.current?.abort();

    // Create a new AbortController for the new request and store it so
    // subsequent interactions can cancel it.
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      // Validate coordinates 
      if (!validateCoordinates(latitude, longitude)) throw new Error('Invalid coordinates');

      // Request reverse-geocoding through 'openstreetmaps.service'. The service
      // enforces a client-side rate limit 
      const raw = await rateLimitedFetchReverseGeocode(latitude, longitude, { signal: ctrl.signal });

      // Parse and format the response for display.
      const parsed = parseNominatimAddress(raw);
      const cityState = formatCityState(parsed);

      // Update the form with both coordinates and the resolved city/state
      setForm((prev) => ({
        ...prev,
        location: { latitude, longitude },
        location_address: cityState,
      }));
    } catch (err: any) {
      if ((err as any).name === 'AbortError') {
        return;
      }

      // Log other errors and update the coordinates
      console.error('Error fetching city:', err);
      setForm((prev) => ({
        ...prev,
        location: { latitude, longitude },
      }));
    } finally {
      // Clear the abortRef if it still points to this controller.
      if (abortRef.current === ctrl) abortRef.current = null;
    }
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

    const point = toPostgresPoint(location.latitude, location.longitude);
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

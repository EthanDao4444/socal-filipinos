import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { supabase } from '@/utils/supabase';

interface EventFormProps {
  visible: boolean;
  onClose: () => void;
  existingEvent?: any;
}

export default function EventForm({ visible, onClose, existingEvent }: EventFormProps) {
  const [form, setForm] = useState({
    event_name: existingEvent?.event_name ?? '',
    event_description: existingEvent?.event_description ?? '',
    start_date: existingEvent ? new Date(existingEvent.start_date) : new Date(),
    end_date: existingEvent ? new Date(existingEvent.end_date) : new Date(),
    organizer_email: existingEvent?.organizer_email ?? '',
    price: existingEvent?.price ? String(existingEvent.price) : '',
    image_url: existingEvent?.image_url ?? '',
    location_address: existingEvent?.location_address ?? '',
    event_location: existingEvent?.event_location ?? {
      latitude: 34.0522,
      longitude: -118.2437, // Default LA
    },
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const mapRef = useRef<MapView | null>(null);

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setForm((prev) => ({
      ...prev,
      event_location: { latitude, longitude },
    }));
  };

  const handleSubmit = async () => {
    const {
      event_name,
      event_description,
      start_date,
      end_date,
      organizer_email,
      price,
      image_url,
      location_address,
      event_location,
    } = form;

    if (!event_name || !event_location) {
      Alert.alert('Error', 'Please enter all required fields.');
      return;
    }

    const point = `POINT(${event_location.longitude} ${event_location.latitude})`;
    const payload = {
      event_name,
      event_description,
      start_date: start_date.toISOString(),
      end_date: end_date.toISOString(),
      organizer_email,
      price: price ? Number(price) : null,
      image_url,
      location_address,
      event_location: point,
    };

    const { error } = existingEvent
      ? await supabase.from('events').update(payload).eq('event_id', existingEvent.id)
      : await supabase.from('events').insert([payload]);

    if (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', existingEvent ? 'Event updated' : 'Event added');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/50">
        <ScrollView className="bg-white w-11/12 rounded-2xl p-5 max-h-[90%]">
          <Text className="text-xl font-bold text-center mb-4">
            {existingEvent ? 'Edit Event' : 'Add Event'}
          </Text>

          {/* Inputs */}
          <TextInput
            placeholder="Event Name"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2"
            value={form.event_name}
            onChangeText={(val) => setForm({ ...form, event_name: val })}
          />
          <TextInput
            placeholder="Description"
            multiline
            className="border border-gray-300 rounded-md px-3 py-2 mb-2"
            value={form.event_description}
            onChangeText={(val) => setForm({ ...form, event_description: val })}
          />
          <TextInput
            placeholder="Organizer Email"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2"
            value={form.organizer_email}
            onChangeText={(val) => setForm({ ...form, organizer_email: val })}
          />
          <TextInput
            placeholder="Price"
            keyboardType="numeric"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2"
            value={form.price}
            onChangeText={(val) => setForm({ ...form, price: val })}
          />
          <TextInput
            placeholder="Image URL"
            className="border border-gray-300 rounded-md px-3 py-2 mb-2"
            value={form.image_url}
            onChangeText={(val) => setForm({ ...form, image_url: val })}
          />

          {/* Google Places Search */}
          {/* <GooglePlacesAutocomplete
            placeholder="Search for location"
            fetchDetails
            onPress={(data, details = null) => {
              const { lat, lng } = details?.geometry.location;
              setForm({
                ...form,
                location_address: data.description,
                event_location: { latitude: lat, longitude: lng },
              });
              mapRef.current?.animateToRegion({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
            }}
            query={{
              key: 'YOUR_GOOGLE_MAPS_API_KEY',
              language: 'en',
            }}
            styles={{
              textInputContainer: { width: '100%' },
              textInput: { height: 44, color: '#5d5d5d', fontSize: 16 },
            }}
          /> */}

          {/* Map Picker */}
          <View className="mt-3 mb-3 h-64 rounded-xl overflow-hidden">
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: form.event_location.latitude,
                longitude: form.event_location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              onPress={handleMapPress}
            >
              <Marker
                coordinate={form.event_location}
                draggable
                onDragEnd={(e) => {
                  setForm({
                    ...form,
                    event_location: e.nativeEvent.coordinate,
                  });
                }}
              />
            </MapView>
          </View>

          {/* Date pickers */}
          <Pressable onPress={() => setShowStartPicker(true)} className="bg-gray-100 rounded-md py-2 px-3 mb-2">
            <Text>Start: {form.start_date.toLocaleString()}</Text>
          </Pressable>
          {showStartPicker && (
            <DateTimePicker
              value={form.start_date}
              mode="datetime"
              display="default"
              onChange={(e, d) => {
                setShowStartPicker(false);
                if (d) setForm({ ...form, start_date: d });
              }}
            />
          )}

          <Pressable onPress={() => setShowEndPicker(true)} className="bg-gray-100 rounded-md py-2 px-3 mb-2">
            <Text>End: {form.end_date.toLocaleString()}</Text>
          </Pressable>
          {showEndPicker && (
            <DateTimePicker
              value={form.end_date}
              mode="datetime"
              display="default"
              onChange={(e, d) => {
                setShowEndPicker(false);
                if (d) setForm({ ...form, end_date: d });
              }}
            />
          )}

          {/* Buttons */}
          <Pressable onPress={handleSubmit} className="bg-blue-600 rounded-md py-2 mt-3">
            <Text className="text-center text-white font-semibold">
              {existingEvent ? 'Update Event' : 'Save Event'}
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

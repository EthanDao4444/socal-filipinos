import { useState } from 'react';
import { Modal, TextInput, View, Text, Pressable, Alert, ScrollView } from 'react-native';
import { useAdminActions } from '@/hooks/use-admin-actions';

interface EventFormProps {
  visible: boolean;
  onClose: () => void;
}

export default function BusinessForm({ visible, onClose }: EventFormProps) {
  const { addEvent } = useAdminActions();

  const [form, setForm] = useState({
    event_name: '',
    event_description: '',
    start_date: '',
    end_date: '',
    organizer_email: '',
    price: '',
    location_address: '',
    image_url: '',
    event_location: null,
  });

  const handleSubmit = async () => {
    try {
      await addEvent({
        ...form,
        price: Number(form.price),
      });
      Alert.alert('Success', 'Event added!');
      onClose();
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black/50">
        <ScrollView className="bg-white w-80 rounded-2xl p-5 max-h-[80%]">
          <Text className="text-lg font-semibold text-center mb-4">Add Event</Text>

          {Object.keys(form).map((key) => (
            <TextInput
              key={key}
              placeholder={key.replace('_', ' ')}
              className="border border-gray-300 rounded-md px-3 py-2 mb-2"
              value={(form as any)[key]}
              onChangeText={(val) => setForm({ ...form, [key]: val })}
            />
          ))}

          <Pressable className="bg-blue-600 rounded-md py-2 mt-2" onPress={handleSubmit}>
            <Text className="text-center text-white font-semibold">Save</Text>
          </Pressable>
          <Pressable className="bg-gray-300 rounded-md py-2 mt-2" onPress={onClose}>
            <Text className="text-center font-semibold">Cancel</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

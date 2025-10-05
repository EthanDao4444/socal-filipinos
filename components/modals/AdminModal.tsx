import { Modal, Pressable, Text, View } from 'react-native';

interface AdminModalProps {
  visible: boolean;
  onClose: () => void;
}

const AdminModal = ({ visible, onClose }: AdminModalProps) => {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-72 bg-white rounded-2xl p-6">
          <Text className="text-xl font-bold mb-4 text-center">Admin Menu</Text>

          <Pressable
            className="bg-gray-200 rounded-md py-2 px-4 mb-2"
            onPress={() => console.log('Add Event')}
          >
            <Text className="text-center">Add Event</Text>
          </Pressable>

          <Pressable
            className="bg-gray-200 rounded-md py-2 px-4 mb-2"
            onPress={() => console.log('Remove Event')}
          >
            <Text className="text-center">Remove Event</Text>
          </Pressable>

          <Pressable
            className="bg-gray-200 rounded-md py-2 px-4 mb-2"
            onPress={() => console.log('Add Business')}
          >
            <Text className="text-center">Add Business</Text>
          </Pressable>

          <Pressable
            className="bg-gray-200 rounded-md py-2 px-4 mb-4"
            onPress={() => console.log('Remove Business')}
          >
            <Text className="text-center">Remove Business</Text>
          </Pressable>

          <Pressable
            className="bg-red-400 rounded-md py-2 px-4"
            onPress={onClose}
          >
            <Text className="text-center text-white font-semibold">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default AdminModal;

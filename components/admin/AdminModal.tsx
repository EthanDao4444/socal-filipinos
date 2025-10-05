import { useState } from 'react';
import { Modal, Pressable, Text, View, Alert } from 'react-native';
import { useAuthContext } from '@/hooks/use-auth-context'; // where you expose user + role
import { useAdminActions } from '@/hooks/use-admin-actions';
import EventForm from './EventForm';
import BusinessForm from './BusinessForm';
import RemoveEventModal from './RemoveEventModal';
import RemoveBusinessModal from './RemoveBusinessModal';

interface AdminModalProps {
  visible: boolean;
  onClose: () => void;
}

const AdminModal = ({ visible, onClose }: AdminModalProps) => {
  const { user } = useAuthContext();
  const { addEvent, removeEvent, addBusiness, removeBusiness } = useAdminActions();
  const [showEventForm, setShowEventForm] = useState(false);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [showRemoveEventModal, setShowRemoveEventModal] = useState(false);
  const [showRemoveBusinessModal, setShowRemoveBusinessModal] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <Modal transparent visible={visible} onRequestClose={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-72 rounded-2xl p-6">
            <Text className="text-center text-lg font-semibold mb-3">Access Denied</Text>
            <Text className="text-center text-gray-600 mb-4">
              You must be an admin to access this menu.
            </Text>
            <Pressable className="bg-red-500 py-2 rounded-lg" onPress={onClose}>
              <Text className="text-center text-white font-semibold">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-80 bg-white rounded-2xl p-6">
          <Text className="text-xl font-bold mb-4 text-center">Admin Menu</Text>

          <Pressable
            className="bg-blue-100 rounded-md py-2 px-4 mb-2"
            onPress={() => setShowEventForm(true)}
          >
            <Text className="text-center text-blue-700 font-medium">Add / Edit Event</Text>
          </Pressable>

          <Pressable
            className="bg-blue-100 rounded-md py-2 px-4 mb-2"
            onPress={() => setShowRemoveEventModal(true)}
          >
            <Text className="text-center text-blue-700 font-medium">Remove Event</Text>
          </Pressable>

          <Pressable
            className="bg-green-100 rounded-md py-2 px-4 mb-2"
            onPress={() => setShowBusinessForm(true)}
          >
            <Text className="text-center text-green-700 font-medium">Add / Edit Business</Text>
          </Pressable>

          <Pressable
            className="bg-green-100 rounded-md py-2 px-4 mb-2"
            onPress={() => setShowRemoveBusinessModal(true)}
          >
            <Text className="text-center text-green-700 font-medium">Remove Business</Text>
          </Pressable>

          <Pressable className="bg-red-400 rounded-md py-2 px-4" onPress={onClose}>
            <Text className="text-center text-white font-semibold">Close</Text>
          </Pressable>
        </View>
      </View>

      {/* Sub-modals */}
      {showEventForm && <EventForm visible={showEventForm} onClose={() => setShowEventForm(false)} />}
      {showBusinessForm && <BusinessForm visible={showBusinessForm} onClose={() => setShowBusinessForm(false)} />}
      {showRemoveEventModal && <RemoveEventModal visible={showRemoveEventModal} onClose={() => setShowRemoveEventModal(false)} />}
      {showRemoveBusinessModal && <RemoveBusinessModal visible={showRemoveBusinessModal} onClose={() => setShowRemoveBusinessModal(false)} />}
    </Modal>
  );
};

export default AdminModal;

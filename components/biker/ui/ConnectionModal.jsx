import React from 'react';
import { View, Text, TouchableOpacity, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ConnectionModal = ({ visible, onClose, autoAccept, setAutoAccept, isConnected, toggleConnection, setShowFavoritesModal }) => (
  <Modal
    animationType='slide'
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <TouchableOpacity
      className='flex-1 justify-end bg-black/50'
      activeOpacity={1}
      onPressOut={onClose}>
      <TouchableOpacity activeOpacity={1} onPress={e => e.stopPropagation()}>
        <View className='bg-white rounded-t-3xl p-6'>
          <Text className='text-lg font-bold text-center mb-4'>
            {isConnected
              ? 'Tắt kết nối để dừng nhận cuốc'
              : 'Tăng cơ hội nhận cuốc khi bật tự động nhận cuốc'}
          </Text>


          <TouchableOpacity
            className={`rounded-full py-4 items-center mt-6 ${
              isConnected ? 'bg-red-500' : 'bg-[#50dd90]'
            }`}
            onPress={toggleConnection}>
            <Text className='text-white font-medium'>
              {isConnected ? 'TẮT KẾT NỐI' : 'BẬT KẾT NỐI'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

export default ConnectionModal;
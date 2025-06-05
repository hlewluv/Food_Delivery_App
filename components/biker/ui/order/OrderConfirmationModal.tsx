import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

interface OrderConfirmationModalProps {
  visible: boolean;
  onStart: () => void;
}

const OrderConfirmationModal = ({ visible, onStart }: OrderConfirmationModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onStart}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-2xl px-8 py-6 w-[340px] items-center shadow-xl">
          {/* Icon Check */}
          <View className="bg-[#00b14f] rounded-full p-4 mb-4 shadow-md shadow-green-700/20">
            <Text className="text-4xl text-white font-bold">✓</Text>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-800 text-center mb-3">
            Nhận cuốc thành công!
          </Text>

          {/* Subtitle */}
          <Text className="text-base text-gray-600 text-center mb-6">
            Hệ thống đã tự động nhận một cuốc mới cho bạn.
          </Text>

          {/* Button */}
          <TouchableOpacity
            className="bg-[#00b14f] py-3 px-6 rounded-full w-full items-center shadow-lg shadow-green-700/20"
            onPress={onStart}
          >
            <Text className="text-white text-lg font-semibold">Bắt đầu ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default OrderConfirmationModal;
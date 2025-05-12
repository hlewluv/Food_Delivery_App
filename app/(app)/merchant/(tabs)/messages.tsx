// Trong thư mục merchant, ví dụ: app/(app)/merchant/messages.js
import React from 'react';
import { View, Text } from 'react-native';
import MessageScreen from 'app/(app)/(shared)/messages'; // Import từ shared

const Messages = () => {
  // Dữ liệu mẫu cho merchant
  const merchantConversations = [
    { id: '1', name: 'Bùi Cao Thuần • Merchant', time: 'Th 7', message: 'Đơn hàng đã được xác nhận!', unread: 1, avatar: 'https://fagopet.vn/storage/in/r5/inr5f4qalj068szn2bs34qmv28r2_phoi-giong-meo-munchkin.webp', type: 'Biker' },
    { id: '2', name: 'Nguyen Van A • Customer', time: 'Th 6', message: 'Tôi muốn hủy đơn hàng.', unread: 0, avatar: 'https://fagopet.vn/storage/in/r5/inr5f4qalj068szn2bs34qmv28r2_phoi-giong-meo-munchkin.webp', type: 'Customer' },
    { id: '3', name: 'Tran Thi B • Biker', time: 'Th 5', message: 'Đang giao hàng...', unread: 2, avatar: 'https://fagopet.vn/storage/in/r5/inr5f4qalj068szn2bs34qmv28r2_phoi-giong-meo-munchkin.webp', type: 'Biker' },
    { id: '4', name: 'Le Van C • Customer', time: 'Th 4', message: 'Cảm ơn bạn!', unread: 0, avatar: 'https://fagopet.vn/storage/in/r5/inr5f4qalj068szn2bs34qmv28r2_phoi-giong-meo-munchkin.webp', type: 'Customer' },
  ];

  return (
    <View className="flex-1">
      <MessageScreen
        conversations={merchantConversations}
        tabs={['Biker', 'Customer']} // Giữ nguyên tabs như trước
        defaultTab="Biker"
      />
    </View>
  );
};

export default Messages;
// app/(app)/shared/messages/[conversationId].js
import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ConversationDetailScreen = () => {
  const { conversationId, name } = useLocalSearchParams();
  const decodedName = name ? decodeURIComponent(name.toString()) : 'Unknown';

  const [messages, setMessages] = useState([
    { id: '1', sender: 'other', text: 'Xin chào! Đơn hàng của bạn đã được giao.', time: '10:00 AM' },
    { id: '2', sender: 'me', text: 'Cảm ơn bạn! Tôi đã nhận được.', time: '10:02 AM' },
    { id: '3', sender: 'other', text: 'Bạn có cần hỗ trợ gì thêm không?', time: '10:03 AM' },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: (messages.length + 1).toString(), sender: 'me', text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
      setNewMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View className={`mb-3 p-3 rounded-2xl max-w-[80%] shadow-sm ${item.sender === 'me' ? 'bg-green-500 self-end' : 'bg-white self-start'}`}>
      <Text className={`text-base ${item.sender === 'me' ? 'text-white' : 'text-gray-900'}`}>{item.text}</Text>
      <Text className={`text-xs mt-1 text-right ${item.sender === 'me' ? 'text-green-100' : 'text-gray-500'}`}>{item.time}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row justify-center items-center py-4 pt-10 border-b border-gray-200 bg-white shadow-md">
        <TouchableOpacity
          className="absolute left-2 top-8 p-2"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-900">{decodedName}</Text>
      </View>

      {/* Message List */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 80 }}
      />

      {/* Input Area */}
      <View className="flex-row items-center p-3 bg-white border-t border-gray-200 shadow-md">
        <TextInput
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-3 bg-gray-50 shadow-sm text-gray-900"
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          className="bg-green-500 rounded-full p-3"
          onPress={handleSend}
        >
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConversationDetailScreen;
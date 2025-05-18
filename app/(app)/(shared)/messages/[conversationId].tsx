import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import EmojiPicker from 'emoji-picker-react';

// Hàm kiểm tra nền tảng để xử lý chọn file
const isWeb = Platform.OS === 'web';

// Lấy chiều cao màn hình
const { height: screenHeight } = Dimensions.get('window');
const modalHeight = screenHeight * 0.4; // 40% chiều cao màn hình

const ConversationDetailScreen = () => {
  const { conversationId, name, avatar } = useLocalSearchParams();
  const decodedName = name ? decodeURIComponent(name.toString()) : 'Unknown';
  const decodedAvatar = avatar ? decodeURIComponent(avatar.toString()) : 'https://fagopet.vn/storage/in/r5/inr5f4qalj068szn2bs34qmv28r2_phoi-giong-meo-munchkin.webp';

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'other',
      text: 'Xin chào! Đơn hàng của bạn đã được giao.',
      time: '10:00 AM',
    },
    {
      id: '2',
      sender: 'me',
      text: 'Cảm ơn bạn! Tôi đã nhận được.',
      time: '10:02 AM',
    },
    {
      id: '3',
      sender: 'other',
      text: 'Bạn có cần hỗ trợ gì thêm không?',
      time: '10:03 AM',
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const flatListRef = useRef(null);

  // Tự động cuộn xuống khi danh sách tin nhắn thay đổi
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Xử lý chọn ảnh
  const handlePickImage = () => {
    if (isWeb) {
      // Trên web, kích hoạt input file
      fileInputRef.current?.click();
    } else {
      // Trên app, giả lập chọn ảnh
      alert('Chọn ảnh trên app chưa được triển khai. Vui lòng tích hợp react-native-image-picker.');
    }
  };

  // Xử lý file được chọn trên web
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUri = URL.createObjectURL(file);
      setMessages([
        ...messages,
        {
          id: (messages.length + 1).toString(),
          sender: 'me',
          text: '[Image]',
          imageUri,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  // Xử lý chọn emoji
  const handleEmojiSelect = (emojiObject) => {
    setNewMessage(newMessage + emojiObject.emoji);
  };

  // Xử lý gửi tin nhắn
  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: (messages.length + 1).toString(),
          sender: 'me',
          text: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setNewMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View
      className={`flex-row mb-3 items-end ${
        item.sender === 'me' ? 'justify-end' : 'justify-start'
      }`}
    >
      {item.sender === 'other' && (
        <Image
          source={{ uri: decodedAvatar }}
          className="w-8 h-8 rounded-full mr-2 border border-gray-200"
          defaultSource={{ uri: 'https://fagopet.vn/storage/in/r5/inr5f4qalj068szn2bs34qmv28r2_phoi-giong-meo-munchkin.webp' }}
        />
      )}
      <View
        className={`p-3 rounded-2xl max-w-[70%] shadow-sm ${
          item.sender === 'me' ? 'bg-green-500' : 'bg-white'
        }`}
      >
        {item.imageUri ? (
          <Image
            source={{ uri: item.imageUri }}
            className="w-40 h-40 rounded-lg mb-1"
            resizeMode="cover"
          />
        ) : (
          <Text
            className={`text-base ${
              item.sender === 'me' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {item.text}
          </Text>
        )}
        <Text
          className={`text-xs mt-1 text-right ${
            item.sender === 'me' ? 'text-green-100' : 'text-gray-500'
          }`}
        >
          {item.time}
        </Text>
      </View>
      {item.sender === 'me' && (
        <Image
          source={{ uri: 'https://fagopet.vn/storage/in/r5/inr5f4qalj068szn2bs34qmv28r2_phoi-giong-meo-munchkin.webp' }}
          className="w-8 h-8 rounded-full ml-2 border border-gray-200"
          defaultSource={{ uri: 'https://fagopet.vn/storage/in/r5/inr5f4qalj068szn2bs34qmv28r2_phoi-giong-meo-munchkin.webp' }}
        />
      )}
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
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 80 }}
      />

      {/* Input Area */}
      <View className="flex-row items-center p-3 bg-white border-t border-gray-200 shadow-md">
        <TouchableOpacity
          className="p-2 mr-2"
          onPress={handlePickImage}
        >
          <Ionicons name="add-circle-outline" size={28} color="#000" />
        </TouchableOpacity>
        {isWeb && (
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        )}
        <TouchableOpacity
          className="p-2 mr-2"
          onPress={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Ionicons name="happy-outline" size={28} color="#000" />
        </TouchableOpacity>
        <TextInput
          className="flex-1 border border-gray-300 rounded-full px-4 py-3 mr-3 bg-gray-50 shadow-sm text-gray-900 h-12"
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity
          className="bg-green-500 rounded-full p-3"
          onPress={handleSend}
        >
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Emoji Picker Modal */}
      <Modal
        isVisible={showEmojiPicker}
        onBackdropPress={() => setShowEmojiPicker(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View
          className="bg-white rounded-t-2xl p-4"
          style={{ maxHeight: modalHeight }} // 40% chiều cao màn hình
        >
          <EmojiPicker
            onEmojiClick={handleEmojiSelect}
            style={{ width: '100%' }}
            emojiStyle="native"
          />
          <TouchableOpacity
            className="absolute top-2 right-2 p-2"
            onPress={() => setShowEmojiPicker(false)}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ConversationDetailScreen;
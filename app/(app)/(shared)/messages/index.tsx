import React, { useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const MessageScreen = ({ conversations: propConversations, tabs, defaultTab = 'Biker' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  // Dữ liệu mẫu mặc định nếu không có props conversations
  const defaultConversations = [
    {
      id: '1',
      name: 'Bùi Cao Thuần • GrabFood',
      time: 'Th 7',
      message: 'Cuộc trò chuyện này vẫn sẽ được mở để...',
      unread: 2,
      avatar:
        'https://fagopet.vn/storage/in/r5/inr5f4qalj068szn2bs34qmv28r2_phoi-giong-meo-munchkin.webp',
      type: 'Biker'
    },
    {
      id: '2',
      name: 'Nguyen Van A • Shopee',
      time: 'Th 6',
      message: 'Cảm ơn bạn đã đặt hàng!',
      unread: 0,
      avatar:
        'https://fagopet.vn/storage/in/r5/inr5f4qalj068szn2bs34qmv28r2_phoi-giong-meo-munchkin.webp',
      type: 'Customer'
    },
    {
      id: '3',
      name: 'Tran Thi B • Lazada',
      time: 'Th 5',
      message: 'Đơn hàng của bạn đang được xử lý.',
      unread: 1,
      avatar:
        'https://fagopet.vn/storage/in/r5/inr5f4qalj068szn2bs34qmv28r2_phoi-giong-meo-munchkin.webp',
      type: 'Biker'
    },
    {
      id: '4',
      name: 'Le Van C • Tiki',
      time: 'Th 4',
      message: 'Bạn có muốn đánh giá sản phẩm không?',
      unread: 0,
      avatar:
        'https://fagopet.vn/storage/in/r5/inr5f4qalj068szn2bs34qmv28r2_phoi-giong-meo-munchkin.webp',
      type: 'Customer'
    }
  ]

  const conversations = propConversations || defaultConversations
  const filteredConversations = conversations.filter(conv => conv.type === activeTab)

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className='flex-row p-4 bg-white rounded-xl mx-3 my-2 shadow-sm items-center'
      activeOpacity={0.7}
      onPress={() =>
        router.push(
          `/messages/${item.id}?name=${encodeURIComponent(item.name)}&avatar=${encodeURIComponent(
            item.avatar
          )}`
        )
      }>
      <Image
        source={{ uri: item.avatar || 'https://via.placeholder.com/150' }}
        className='w-14 h-14 rounded-full mr-4 border border-gray-200 shadow-sm'
      />
      <View className='flex-1 py-1'>
        <View className='flex-row justify-between mb-2'>
          <Text className='text-lg font-bold text-gray-800'>{item.name}</Text>
          <Text className='text-sm text-gray-500 font-medium'>{item.time}</Text>
        </View>
        <View className='flex-row justify-between items-center'>
          <Text className='text-base text-gray-600 max-w-[80%] font-normal' numberOfLines={1}>
            {item.message}
          </Text>
          {item.unread > 0 && (
            <View className='bg-green-500 rounded-full w-6 h-6 justify-center items-center shadow-sm'>
              <Text className='text-white text-xs font-semibold'>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View className='flex-1 bg-white'>
      {/* Header */}
      <View className='flex-row items-center p-4 bg-white'>
        <Text className='flex-1 text-center text-4xl font-bold text-gray-900'>Tin nhắn</Text>
      </View>

      {/* Tabs */}
      <View className='flex-row justify-around py-[10] bg-white border-b border-gray-200'>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            className={`px-6 py-2 rounded-full ${
              activeTab === tab ? 'bg-green-500' : 'bg-gray-200'
            }`}
            onPress={() => setActiveTab(tab)}>
            <Text
              className={
                activeTab === tab ? 'text-white font-medium' : 'text-gray-600 font-medium'
              }>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conversation List */}
      <FlatList
        data={filteredConversations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  )
}

export default MessageScreen

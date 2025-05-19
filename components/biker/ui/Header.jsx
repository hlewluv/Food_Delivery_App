import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const Header = ({ balance, formatMoney }) => (
  <View className='absolute top-8 left-0 right-0 flex-row justify-between px-4'>
    <TouchableOpacity
      className='bg-white rounded-full px-4 py-2 flex-row items-center shadow-md'
      onPress={() => router.push('./biker/wallet/income')}>
      <View className='flex-row items-baseline'>
        <Text className='text-xs text-gray-500 mr-1'>VND</Text>
        <Text className='text-base font-medium text-black'>{formatMoney(balance)}</Text>
      </View>
      <View className='w-px h-5 bg-gray-300 mx-3' />
      <View className='flex-row items-center'>
        <Ionicons name='diamond' size={20} color='#FFD700' />
        <Text className='text-base font-medium text-black ml-1'>70</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity className='bg-white rounded-full p-1 shadow-md flex-row items-center'>
      <Image
        source={{
          uri: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482752rhD/anh-mo-ta.png'
        }}
        className='w-8 h-8 rounded-full'
      />
      <View className='flex-row items-center ml-2 px-2 py-1 bg-yellow-50 rounded-full'>
        <Ionicons name='star' size={12} color='#FFD700' />
        <Text className='text-xs font-semibold text-black ml-1'>5.0</Text>
      </View>
    </TouchableOpacity>
  </View>
)

export default Header

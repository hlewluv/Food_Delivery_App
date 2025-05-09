import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons'
import React from 'react'
import { router } from 'expo-router'

const Home = () => {
  return (
    <ScrollView className='bg-white flex-1'>
      {/* Header */}
      <View className='bg-white px-3 pt-5 pb-3'>
        <View className='flex-row justify-between items-start'>
          <View className='flex-row items-baseline'>
            <Text className='text-xl font-bold mr-2'>Chào bạn trở lại!</Text>
            <Text className='text-3xl font-bold'>Bé iu dễ thưn</Text>
          </View>
        </View>
        <View className='flex-row items-center mt-2'>
          <Text className='text-lg mr-2'>Coffee Cafe & Roasters, Ho Chi Minh</Text>
          <Feather name='chevron-down' size={20} color='#6b7280' />
        </View>
        <View className='flex-row items-center mt-2'>
          <Feather name='archive' size={16} color='#6b7280' />
          <Text className='text-gray-500 ml-1'>17.1k</Text>
        </View>
      </View>

      {/* Revenue Section */}
      <View className='bg-green-600 rounded-xl p-4 mt-4 mx-3'>
        <View className='flex-row justify-between items-center'>
          <View>
            <Text className='text-white text-sm'>Doanh thu hôm nay</Text>
            <Text className='text-white text-3xl font-bold mt-1'>₫ 800.00</Text>
          </View>
          <View>
            <Text className='text-white text-sm'>Doanh thu hôm qua</Text>
            <Text className='text-white text-base mt-1'>800.00 ₫</Text>
          </View>
        </View>
        <View className='flex-row justify-between items-center mt-3 pt-3 border-t border-white/30'>
          <View className='flex-row items-center'>
            <Feather name='shopping-bag' size={18} color='white' />
            <Text className='text-white text-sm ml-2'>250 đơn hàng</Text>
          </View>
          <View className='flex-row items-center'>
            <MaterialIcons name='qr-code' size={18} color='white' />
            <Text className='text-white text-sm ml-2'>1.2k thanh toán QR</Text>
          </View>
        </View>
      </View>

      {/* Management Section */}
      <View className='bg-white mt-3 px-3 py-4'>
        <View className='flex-row flex-wrap justify-between'>
          {/* Đơn hàng */}
          <TouchableOpacity
            className='items-center w-1/4 mb-4 '
            onPress={() => router.push('/merchant/order')} // Navigate to the Order screen
          >
            <View className='bg-white p-3 rounded-full border border-gray-200 shadow-sm'>
              <Feather name='shopping-bag' size={24} color='#3b82f6' />
            </View>
            <Text className='mt-2 text-sm text-center'>Đơn hàng</Text>
          </TouchableOpacity>

          {/* Thực đơn */}
          <TouchableOpacity className='items-center w-1/4 mb-4'>
            <View className='bg-white p-3 rounded-full border border-gray-200 shadow-sm'>
              <Feather name='book-open' size={24} color='#3b82f6' />
              <View className='absolute -top-1 -right-1 bg-red-500 rounded-full h-5 w-5 flex items-center justify-center'>
                <Text className='text-white text-xs'>1</Text>
              </View>
            </View>
            <Text className='mt-2 text-sm text-center'>Thực đơn</Text>
          </TouchableOpacity>

          {/* Khuyến mãi */}
          <TouchableOpacity className='items-center w-1/4 mb-4'>
            <View className='bg-white p-3 rounded-full border border-gray-200 shadow-sm'>
              <Ionicons name='pricetag' size={24} color='#3b82f6' />
            </View>
            <Text className='mt-2 text-sm text-center'>Khuyến mãi</Text>
          </TouchableOpacity>

          {/* Báo cáo */}
          <TouchableOpacity className='items-center w-1/4 mb-4'>
            <View className='bg-white p-3 rounded-full border border-gray-200 shadow-sm'>
              <Feather name='bar-chart-2' size={24} color='#3b82f6' />
            </View>
            <Text className='mt-2 text-sm text-center'>Báo cáo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Latest News Section */}
      <View className='bg-white  px-3 mb-5'>
        <Text className='text-lg font-semibold mb-4'>Có gì mới?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity className='mr-4 active:opacity-70'>
            <View className='w-56 h-64 bg-white rounded-xl flex-col border border-gray-200 p-3 shadow-sm'>
              <Image
                source={{
                  uri: 'https://ecpvn.com/wp-content/uploads/2021/11/quang-cao-la-gi-cac-kenh-quang-cao-online-nao-hieu-qua.jpg'
                }}
                className='w-full h-32 rounded-lg self-center mb-2'
              />
              <Text className='font-medium text-left line-clamp-2 text-ellipsis mb-2'>
                Khám phá hành trình GrabAcademy với nhiều trải nghiệm mới
              </Text>
              <View className='border-t border-gray-300 my-2' />
              <View className='flex-row justify-between items-center mt-auto'>
                <Text className='text-blue-500'>Tìm hiểu thêm</Text>
                <Feather name='chevron-right' size={16} color='#3b82f6' />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className='mr-4 active:opacity-70'>
            <View className='w-56 h-64 bg-white rounded-xl flex-col border border-gray-200 p-3 shadow-sm'>
              <Image
                source={{
                  uri: 'https://ecpvn.com/wp-content/uploads/2021/11/quang-cao-la-gi-cac-kenh-quang-cao-online-nao-hieu-qua.jpg'
                }}
                className='w-full h-32 rounded-lg self-center mb-2'
              />
              <Text className='font-medium text-left line-clamp-2 text-ellipsis mb-2'>
                Khám phá hành trình GrabAcademy với nhiều trải nghiệm mới
              </Text>
              <View className='border-t border-gray-300 my-2' />
              <View className='flex-row justify-between items-center mt-auto'>
                <Text className='text-blue-500'>Tìm hiểu thêm</Text>
                <Feather name='chevron-right' size={16} color='#3b82f6' />
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ScrollView>
  )
}

export default Home

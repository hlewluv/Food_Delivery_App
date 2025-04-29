import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {  images } from '@/constant/images';
import { icons } from '@/constant/icons';

const Header = () => {
  return (
    <View className='flex-row items-center justify-between px-6 py-3 bg-white mx-2'>
      <View className='flex-row items-center flex-1'>
        <Image source={images.hero1} className='w-12 h-12 rounded-full' resizeMode='contain' />
        <View className='ml-3'>
          <View className='flex-row items-center'>
            <Text className='font-[300] text-gray-800' numberOfLines={1}>
              Delivery to
            </Text>
            <Image
              source={icons.down}
              className='w-6 h-6'
              resizeMode='contain'
              style={{ tintColor: '#00b14f' }}
            />
          </View>
          <Text
            className='font-medium text-gray-800 mt-1 w-[130px]'
            numberOfLines={1}
            ellipsizeMode='tail'>
            123 Đường ABC, Quận 1, TP.HCM
          </Text>
        </View>
      </View>
      <View className='flex-row ml-4'>
        <TouchableOpacity className='mx-3'>
          <View className='rounded-full border border-gray-300 bg-white p-3'>
            <Image
              source={icons.bag}
              className='w-6 h-6'
              resizeMode='contain'
              style={{ tintColor: '#4B5563' }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity className='mx-2'>
          <View className='rounded-full border border-gray-300 bg-white p-3'>
            <Image
              source={icons.mail}
              className='w-6 h-6'
              resizeMode='contain'
              style={{ tintColor: '#4B5563' }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
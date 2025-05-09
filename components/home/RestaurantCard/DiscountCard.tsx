import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { icons } from '@/constant/icons';

// Trong file DiscountCard.tsx
interface DiscountCardProps {
  item: {
    id: string;
    name: string;
    image: any;
    discount?: string; // Thêm dấu ? để biến nó thành optional
    rating: number;
    time: string;
  };
  isLiked: boolean;
  onToggleLike: () => void;
  onPress?: () => void;
}
const DiscountCard = ({ item, isLiked, onToggleLike, onPress }: DiscountCardProps) => {
  return (
    <TouchableOpacity className='mr-4 w-48' onPress={onPress}>
      <View className='relative'>
        <Image source={item.image} className='w-full h-32 rounded-xl' />
        <View className='absolute top-2 left-2 bg-red-500/80 px-2 py-1 rounded-xl'>
          <Text className='text-white text-xs font-bold'>{item.discount} OFF</Text>
        </View>
        <TouchableOpacity className='absolute top-2 right-2' onPress={onToggleLike}>
          <Image 
            source={isLiked ? icons.heart1 : icons.heart} 
            className='w-6 h-6' 
            style={{ tintColor: isLiked ? '#00b14f' : 'white' }} 
          />
        </TouchableOpacity>
      </View>
      <Text className='mt-2 font-medium text-gray-900'>{item.name}</Text>
      <View className='flex-row items-center mt-1'>
        <Image source={icons.star} className='w-4 h-4 mr-1' style={{ tintColor: '#FFFF00' }} />
        <Text className='text-gray-700 text-sm'>{item.rating}</Text>
        <Text className='text-gray-500 text-sm mx-1'>•</Text>
        <Image source={icons.clock} className='w-4 h-4 mr-1' style={{ tintColor: '#000000' }} />
        <Text className='text-gray-700 text-sm'>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DiscountCard;
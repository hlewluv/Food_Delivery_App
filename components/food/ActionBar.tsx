import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

interface ActionBarProps {
  quantity: number
  totalPrice: string
  onDecrease: () => void
  onIncrease: () => void
  onAddToCart: () => void
}

const ActionBar = ({
  quantity,
  totalPrice,
  onDecrease,
  onIncrease,
  onAddToCart
}: ActionBarProps) => {
  return (
    <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4'>
      <View className='flex-row justify-between items-center'>
        {/* Quantity Selector */}
        <View className='flex-row items-center bg-gray-100 rounded-full px-1 py-1 shadow-sm w-48 justify-between'>
  <TouchableOpacity
    className='w-10 h-10 justify-center items-center'
    activeOpacity={0.7}
    onPress={onDecrease}
    disabled={quantity <= 1}>
    <Feather
      name='minus'
      size={20}
      color={quantity <= 1 ? '#d1d5db' : '#374151'}
    />
  </TouchableOpacity>
  
  <Text className='text-lg font-semibold text-gray-800 min-w-[24px] text-center'>
    {quantity}
  </Text>
  
  <TouchableOpacity
    className='w-10 h-10 justify-center items-center'
    activeOpacity={0.7}
    onPress={onIncrease}>
    <Feather name='plus' size={20} color='#374151' />
  </TouchableOpacity>
</View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          className='bg-primary px-6 py-3 rounded-full flex-row items-center shadow-md'
          activeOpacity={0.9}
          onPress={onAddToCart}>
          <Text className='text-white font-semibold mr-3 text-base'>Thêm vào giỏ</Text>
          <Text className='text-white font-bold text-base'>{totalPrice}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ActionBar
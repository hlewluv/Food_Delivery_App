import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'

interface AdditionalOption {
  name: string
  description: string
  price: string
  selected: boolean
}

interface AdditionalOptionsProps {
  options: AdditionalOption[]
  selectedCount: number
  onToggleOption: (index: number) => void
}

const AdditionalOptions = ({ options, selectedCount, onToggleOption }: AdditionalOptionsProps) => {
  return (
    <View className='mb-6 mx-5'>
      {/* Header section */}
      <View className='flex-row justify-between items-center mb-3'>
        <Text className='text-lg font-semibold text-gray-800'>Chọn Món Thêm</Text>
        <View className='flex-row items-center'>
          <Text className='text-gray-500 text-sm'>{selectedCount}/7 đã chọn</Text>
        </View>
      </View>

      {/* Options list */}
      <View className='bg-white'>
        {options.map((option, index) => (
          <AdditionalOptionItem
            key={`option-${index}`}
            option={option}
            isLast={index === options.length - 1}
            onPress={() => onToggleOption(index)}
          />
        ))}
      </View>

      {/* Footer note */}
      <Text className='text-gray-400 text-xs mt-2 ml-1'>
        * Chọn tối đa 7 món thêm. Giá sẽ được cộng thêm vào tổng đơn hàng.
      </Text>
    </View>
  )
}

const AdditionalOptionItem = ({
  option,
  isLast,
  onPress
}: {
  option: AdditionalOption
  isLast: boolean
  onPress: () => void
}) => (
  <TouchableOpacity
    className={`flex-row items-center py-3${!isLast ? ' border-gray-100' : ''}`}
    activeOpacity={0.7}
    onPress={onPress}>
    {/* Checkbox */}
    <View className='mr-3'>
      {option.selected ? (
        <MaterialIcons name='check-box' size={24} color='#00b14f' />
      ) : (
        <MaterialIcons name='check-box-outline-blank' size={24} color='#d1d5db' />
      )}
    </View>

    {/* Content */}
    <View className='flex-1'>
      <Text className={`font-medium ${option.selected ? 'text-gray-800' : 'text-gray-700'}`}>
        {option.name}
      </Text>
      {option.description && (
        <Text className='text-gray-500 text-sm mt-1'>{option.description}</Text>
      )}
    </View>

    {/* Price */}
    <Text className={`ml-2 font-medium ${option.selected ? 'text-green-500' : 'text-gray-500'}`}>
      {option.price}
    </Text>
  </TouchableOpacity>
)

export default AdditionalOptions

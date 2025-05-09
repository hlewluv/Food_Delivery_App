import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { icons } from '@/constant/icons'
import { useRouter } from 'expo-router'

// export interface Restaurant {
//   id: string
//   name: string
//   image: any
//   discount?: string
//   rating: number
//   time: string
//   category: string
//   categoryId: string
//   isRecommended?: boolean
//   description?: string
//   deliveryTime?: string
//   menuItems?: Array<{
//     id: string
//     category: string
//     items: Array<{
//       id: string
//       name: string
//       restaurant: string
//       price: string
//       description?: string
//       image: any // Bắt buộc phải có ảnh cho mỗi món ăn
//     }>
//   }>
// }

// interface RecommendedCardProps {
//   item: Restaurant
//   isLiked: boolean
//   onToggleLike: (id: string) => void
// }

type RecommendedCardProps = any

const RecommendedCard: React.FC<RecommendedCardProps> = ({ item, isLiked, onToggleLike }) => {
  const router = useRouter()

  const handlePress = () => {
    router.push({
      pathname: `/customer/restaurants/[id]`,  // Use the exact route pattern

      params: {
        id: item.id,  // Pass the id separately
        restaurant: JSON.stringify({
          ...item,
          description: item.description || 'Mô tả nhà hàng',
          deliveryTime: item.deliveryTime || '20-30 phút',
          menuItems: item.menuItems || []
        })
      }
    })
  }

  const handleLikePress = (e: any) => {
    e.stopPropagation()
    onToggleLike(item.id)
  }

  return (
    <TouchableOpacity
      className='flex-row items-center my-4 mx-6 bg-white rounded-lg shadow-sm p-3'
      onPress={handlePress}
      activeOpacity={0.8}
      testID='restaurant-card'>
      <Image
        source={item.image}
        className='w-20 h-20 rounded-xl'
        resizeMode='cover'
        accessibilityLabel={`Ảnh ${item.name}`}
      />

      <View className='ml-3 flex-1'>
        <Text
          className='font-semibold text-gray-900 text-base'
          numberOfLines={1}
          ellipsizeMode='tail'>
          {item.name}
        </Text>

        <View className='flex-row items-center mt-1'>
          <Image
            source={icons.star}
            className='w-5 h-5 mr-1'
            style={{ tintColor: '#FFD700' }}
            accessibilityLabel='Đánh giá sao'
          />
          <Text className='text-gray-700 text-sm'>{item.rating.toFixed(1)}</Text>
          <Text className='text-gray-500 text-sm mx-1'>•</Text>
          <Image
            source={icons.clock}
            className='w-4 h-4 mr-1'
            style={{ tintColor: '#6B7280' }}
            accessibilityLabel='Thời gian giao hàng'
          />
          <Text className='text-gray-700 text-sm'>{item.time}</Text>
        </View>

        <Text className='text-gray-500 text-sm mt-1' numberOfLines={1} ellipsizeMode='tail'>
          {item.category}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleLikePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel={isLiked ? 'Bỏ thích' : 'Thích'}
        testID='like-button'>
        <Image
          source={isLiked ? icons.heart1 : icons.heart}
          className='w-6 h-6'
          style={{ tintColor: isLiked ? '#00b14f' : '#808080' }}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default React.memo(RecommendedCard)
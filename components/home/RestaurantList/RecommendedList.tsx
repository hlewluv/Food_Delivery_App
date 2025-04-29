import React from 'react'
import { FlatList, View, Text } from 'react-native'
import SectionHeader from '@/components/SectionHeader'
import RecommendedCard from '../RestaurantCard/RecommendedCard'
import { getRecommendedRestaurants, Restaurant } from '@/data/restaurants'

interface RecommendedListProps {
  likedRestaurants: Record<string, boolean>
  toggleLike: (id: string) => void
  categoryId?: string
  onRestaurantPress?: (restaurant: Restaurant) => void
}

const RecommendedList = ({ 
  likedRestaurants, 
  toggleLike, 
  categoryId,
  onRestaurantPress 
}: RecommendedListProps) => {
  // Lấy dữ liệu nhà hàng được đề xuất
  const recommendedRestaurants = getRecommendedRestaurants(categoryId)

  return (
    <View className='mt-4'>
      <SectionHeader 
        title={categoryId ? 'Đề xuất trong mục này' : 'Nhà hàng đề xuất'} 
      />
      
      {recommendedRestaurants.length === 0 ? (
        <Text className='text-center text-gray-500 py-4'>Không có nhà hàng nào</Text>
      ) : (
        <FlatList
          data={recommendedRestaurants}
          renderItem={({ item }) => (
            <RecommendedCard
              item={item}
              isLiked={likedRestaurants[item.id] || false}
              onToggleLike={() => toggleLike(item.id)}
              onPress={() => onRestaurantPress?.(item)}
            />
          )}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      )}
    </View>
  )
}

export default RecommendedList
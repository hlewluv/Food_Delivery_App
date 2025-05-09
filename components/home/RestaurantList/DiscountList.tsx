import React from 'react'
import { FlatList, View } from 'react-native'
import SectionHeader from '@/components/SectionHeader'
import DiscountCard from '../RestaurantCard/DiscountCard'
import { getDiscountRestaurants, getRestaurantsByCategoryId, Restaurant } from '@/data/restaurants'
import { router } from 'expo-router'

interface DiscountListProps {
  likedRestaurants: Record<string, boolean>
  toggleLike: (id: string) => void
  categoryId?: string
}

const DiscountList = ({ likedRestaurants, toggleLike, categoryId }: DiscountListProps) => {
  const discountRestaurants = categoryId 
    ? getRestaurantsByCategoryId(categoryId).filter(r => r.discount)
    : getDiscountRestaurants()

  if (categoryId && discountRestaurants.length === 0) {
    return null
  }

  const handleRestaurantPress = (item: Restaurant) => {
    router.push({
      pathname: `/customer/restaurants/[id]`,

      params: {
        id: item.id,
        restaurant: JSON.stringify({
          ...item,
          description: item.description || 'Mô tả nhà hàng',
          deliveryTime: item.deliveryTime || '20-30 phút',
          menuItems: item.menuItems || []
        })
      }
    })
  }

  return (
    <View className='mt-4'>
      <SectionHeader title={categoryId ? 'Deal trong mục này' : 'Siêu Deal Quán Đỉnh'} />
      <FlatList
        data={discountRestaurants}
        renderItem={({ item }) => (
          <DiscountCard
            item={item}
            isLiked={likedRestaurants[item.id]}
            onToggleLike={() => toggleLike(item.id)}
            onPress={() => handleRestaurantPress(item)}
          />
        )}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 28, paddingRight: 40, paddingVertical: 10 }}
      />
    </View>
  )
}

export default DiscountList
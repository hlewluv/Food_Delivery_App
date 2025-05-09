import React, { useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons'
import FoodItem from '@/components/restaurant/foodItemOx'
import FoodItemSmall from '@/components/restaurant/foodItemOy'
import ReviewCard from '@/components/restaurant/review'

interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  image?: any
  time?: string
  discount?: string
  options?: {
    name: string
    selected: boolean
  }[]
}

interface MenuSection {
  id: string
  category: string
  items: MenuItem[]
}

interface Restaurant {
  id: string
  name: string
  image: any
  rating: number
  deliveryTime?: string
  time?: string
  menuItems?: MenuSection[]
}

interface CartItem {
  item: MenuItem
  quantity: number
}

const reviews = [
  {
    id: '1',
    username: 'KimChil',
    rating: 5,
    comment: 'bún ngon, mầm nêm rất vừa vị ko bị ngọt. khẩu phần rất vừa ăn. dóg hộp rất tiện lợi.',
    date: '2 ngày trước'
  }
]

const RestaurantDetail: React.FC = () => {
  const router = useRouter()
  const { id, restaurant } = useLocalSearchParams<{
    id: string
    restaurant?: string
  }>()

  const restaurantData: Restaurant | null = restaurant ? JSON.parse(restaurant) : null
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const handleFoodPress = (foodItem: MenuItem) => {
    router.push({
      pathname: `/customer/foodDetail/${foodItem.id}`,
      params: {
        food: JSON.stringify({
          ...foodItem,
          restaurantName: restaurantData?.name,
          restaurantImage: restaurantData?.image
        })
      }
    })
  }

  const handleBackPress = () => {
    router.back()
  }

  const handleAddToCart = (item: MenuItem, quantityChange: number) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.item.id === item.id)
      
      if (existingItemIndex >= 0) {
        // Item already exists in cart
        const updatedItems = [...prevItems]
        const newQuantity = updatedItems[existingItemIndex].quantity + quantityChange
        
        if (newQuantity <= 0) {
          // Remove item if quantity becomes 0 or less
          return updatedItems.filter((_, index) => index !== existingItemIndex)
        }
        
        // Update quantity
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity
        }
        return updatedItems
      } else if (quantityChange > 0) {
        // Add new item to cart
        return [...prevItems, { item, quantity: quantityChange }]
      }
      
      return prevItems
    })
  }

  const handleViewCart = () => {
    // Log the cart items to the console
    console.log('Cart Items:', cartItems);
    
    router.push({
      pathname: '/customer/cart',
      params: {
        cart: JSON.stringify(cartItems),
        restaurant: JSON.stringify(restaurantData)
      }
    })
  }

  // Calculate total items and total price
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = cartItems.reduce((total, item) => {
    const price = parseFloat(item.item.price.replace(/[^\d]/g, ''))
    return total + (price * item.quantity)
  }, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  if (!restaurantData) {
    return (
      <View className='flex-1 justify-center items-center bg-gray-50'>
        <Text className='mt-4 text-gray-500'>Đang tải thông tin nhà hàng...</Text>
      </View>
    )
  }

  return (
    <View className='flex-1 bg-gray-50'>
      <ScrollView showsVerticalScrollIndicator={false} className='pb-24'>
        {/* Image Header */}
        <View className='bg-white relative'>
          <Image
            source={restaurantData.image}
            className='w-full h-56'
            resizeMode='cover'
            blurRadius={6}
          />

          {/* Header Buttons */}
          <View className='absolute top-12 left-0 right-0 flex-row justify-between px-6'>
            <TouchableOpacity
              className='w-10 h-10 rounded-full bg-black/50 justify-center items-center'
              onPress={handleBackPress}>
              <Feather name='arrow-left' size={24} color='white' />
            </TouchableOpacity>
            <TouchableOpacity className='w-10 h-10 rounded-full bg-black/50 justify-center items-center'>
              <Feather name='heart' size={20} color='white' />
            </TouchableOpacity>
          </View>

          {/* Restaurant Info Card */}
          <View className='mx-5 -mt-16 relative z-20'>
            <View className='bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden'>
              <View className='px-5 py-4 flex-row items-start'>
                <View className='relative'>
                  <Image
                    source={restaurantData.image}
                    className='w-24 h-24 rounded-lg mr-3 border-2 border-white shadow-lg'
                    resizeMode='cover'
                  />
                </View>

                <View className='flex-1'>
                  <View className='mb-2'>
                    <Text className='text-2xl font-bold text-gray-900' numberOfLines={1}>
                      {restaurantData.name}
                    </Text>
                  </View>

                  <View className='mb-1'>
                    <View className='flex-row items-center mb-2'>
                      <Ionicons name='star' size={16} color='#FFD700' />
                      <Text className='ml-1 font-semibold text-gray-900 text-sm'>
                        {restaurantData.rating.toFixed(1)}
                      </Text>
                      <Text className='ml-1 text-gray-500 text-sm'>(103)</Text>
                    </View>

                    <View className='flex-row items-center'>
                      <Ionicons name='time-outline' size={16} color='#6b7280' />
                      <Text className='text-gray-500 text-sm ml-1'>
                        {restaurantData.deliveryTime || restaurantData.time}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Discounts Section */}
        <View className='bg-white px-7 py-4 mt-4'>
          <Text className='text-lg font-bold text-gray-900 mb-4'>Mã giảm giá đây nèee</Text>

          <View className='mb-4 border-b border-gray-200 pb-4'>
            <TouchableOpacity className='mb-3 flex-row items-center'>
              <View className='bg-blue-100 p-2 rounded-lg mr-3'>
                <MaterialIcons name='local-offer' size={20} color='#3b82f6' />
              </View>
              <View>
                <Text className='font-semibold text-gray-900'>Đăng ký GrabUnlimited</Text>
                <Text className='text-gray-500 text-sm mt-0.5'>Giảm 8.000đ giao hàng</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className='flex-row items-center'>
              <View className='bg-purple-100 p-2 rounded-lg mr-3'>
                <MaterialIcons name='groups' size={20} color='#8b5cf6' />
              </View>
              <View>
                <Text className='font-semibold text-gray-900'>Ưu đãi đến 10%</Text>
                <Text className='text-gray-500 text-sm mt-0.5'>Đặt đơn nhóm</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Grid Section */}
        <View className='bg-white px-4'>
          <Text className='text-xl font-bold text-gray-900 mb-4 px-2'>Món ăn nổi bật</Text>
          {restaurantData.menuItems?.map(section => (
            <View key={section.id} className='mb-8'>
              <View className='flex flex-row flex-wrap'>
                {section.items.map(item => (
                  <View key={item.id} className='w-1/2 p-2'>
                    <FoodItemSmall
                      item={{
                        ...item,
                        image: item.image || restaurantData.image
                      }}
                      onPress={() => handleFoodPress(item)}
                      onAddToCart={(quantity: number) => handleAddToCart(item, quantity)}
                      quantity={cartItems.find(cartItem => cartItem.item.id === item.id)?.quantity || 0}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Reviews Section */}
        <View className='bg-gray-50 px-5 py-2'>
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </View>

        {/* Full Menu List Section */}
        <View className='bg-white px-7 mt-1'>
          {restaurantData.menuItems?.map(section => (
            <View key={section.id} className='mb-6'>
              <Text className='text-lg font-bold text-gray-900 mb-4'>{section.category}</Text>
              {section.items.map(item => (
                <FoodItem
                  key={item.id}
                  item={{
                    ...item,
                    image: item.image || restaurantData.image
                  }}
                  onPress={() => handleFoodPress(item)}
                  onAddToCart={(quantity: number) => handleAddToCart(item, quantity)}
                  quantity={cartItems.find(cartItem => cartItem.item.id === item.id)?.quantity || 0} onRemoveFromCart={undefined} onUpdateQuantity={undefined}                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Bottom Button - Only show when there are items in cart */}
      {totalItems > 0 && (
        <View className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3'>
          <TouchableOpacity
            className='bg-green-500 px-6 py-3 rounded-full items-center shadow-md flex-row justify-between'
            activeOpacity={0.9}
            onPress={handleViewCart}
          >
            <View className='flex-row items-center'>
              <View className='bg-green-600 rounded-full w-6 h-6 justify-center items-center mr-2'>
                <Text className='text-white font-bold text-sm'>{totalItems}</Text>
              </View>
              <Text className='text-white font-bold text-lg'>Xem giỏ hàng</Text>
            </View>
            <Text className='text-white font-bold text-lg'>
              {formatCurrency(totalPrice)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default RestaurantDetail
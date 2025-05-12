import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import FoodItem from '@/components/restaurant/foodItemOx';
import FoodItemSmall from '@/components/restaurant/foodItemOy';
import ReviewCard from '@/components/restaurant/review';

interface MenuItem {
  id: string;
  food_name: string;
  description: string;
  price: string;
  image: string;
  time?: string;
  food_type: string;
  option_menu?: Array<{
    id: string;
    option_name: string;
  }>;
}

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  delivery_time?: string;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

const RestaurantDetail: React.FC = () => {
  const router = useRouter();
  const { id, restaurant, restaurantDetails } = useLocalSearchParams<{
    id: string;
    restaurant?: string;
    restaurantDetails?: string;
  }>();

  const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurant) {
      try {
        const parsedRestaurant = JSON.parse(restaurant);
        setRestaurantData(parsedRestaurant);
        
        if (restaurantDetails) {
          const parsedDetails = JSON.parse(restaurantDetails);
          setMenuItems(parsedDetails);
        }
      } catch (error) {
        console.error('Error parsing restaurant data:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [restaurant, restaurantDetails]);

  const groupMenuItemsByCategory = () => {
    const categories = new Map<string, MenuItem[]>();
    
    menuItems.forEach(item => {
      const category = item.food_type || 'Other';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)?.push(item);
    });
    
    return Array.from(categories.entries()).map(([category, items]) => ({
      id: category,
      category,
      items
    }));
  };

  const menuSections = groupMenuItemsByCategory();
  const featuredItems = menuItems.slice(0, 4); // Show first 4 items as featured

  // const handleFoodPress = (foodItem: MenuItem) => {
  //   router.push({
  //     pathname: `/customer/foodDetail/[id]`,
  //     params: {
  //       food: JSON.stringify({
  //         ...foodItem,
  //         restaurantName: restaurantData?.name,
  //         restaurantImage: restaurantData?.image
  //       })
  //     }
  //   });
  // };

  const handleBackPress = () => {
    router.back();
  };

  const handleAddToCart = (item: MenuItem, quantityChange: number) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.item.id === item.id);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantityChange;
        
        if (newQuantity <= 0) {
          return updatedItems.filter((_, index) => index !== existingItemIndex);
        }
        
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity
        };
        return updatedItems;
      } else if (quantityChange > 0) {
        return [...prevItems, { item, quantity: quantityChange }];
      }
      
      return prevItems;
    });
  };

  const handleViewCart = () => {
    router.push({
      pathname: '/customer/cart',
      params: {
        cart: JSON.stringify(cartItems),
        restaurant: JSON.stringify(restaurantData)
      }
    });
  };

  const formatCurrency = (amount: string) => {
    const numericAmount = parseFloat(amount);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numericAmount);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => {
    const price = parseFloat(item.item.price);
    return total + (price * item.quantity);
  }, 0);

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-gray-50'>
        <Text className='mt-4 text-gray-500'>Đang tải thông tin nhà hàng...</Text>
      </View>
    );
  }

  if (!restaurantData) {
    return (
      <View className='flex-1 justify-center items-center bg-gray-50'>
        <Text className='mt-4 text-gray-500'>Không tìm thấy thông tin nhà hàng</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-gray-50'>
      <ScrollView showsVerticalScrollIndicator={false} className='pb-24'>
        {/* Image Header */}
        <View className='bg-white relative'>
          <Image
            source={{ uri: restaurantData.image }}
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
                    source={{ uri: restaurantData.image }}
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

                    {restaurantData.delivery_time && (
                      <View className='flex-row items-center'>
                        <Ionicons name='time-outline' size={16} color='#6b7280' />
                        <Text className='text-gray-500 text-sm ml-1'>
                          {restaurantData.delivery_time}
                        </Text>
                      </View>
                    )}
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

        {/* Featured Menu Items Section */}
        {featuredItems.length > 0 && (
          <View className='bg-white px-4'>
            <Text className='text-xl font-bold text-gray-900 mb-4 px-2'>Món ăn nổi bật</Text>
            <View className='flex flex-row flex-wrap'>
              {featuredItems.map(item => (
                <View key={item.id} className='w-1/2 p-2'>
                  <FoodItemSmall
                    item={{
                      id: item.id,
                      name: item.food_name,
                      description: item.description,
                      price: item.price,
                      image: item.image ? { uri: item.image } : null,
                      time: item.time
                    }}
                    onPress={console.log('chi tiết món ăn')}
                    onAddToCart={(quantity: number) => handleAddToCart(item, quantity)}
                    quantity={cartItems.find(cartItem => cartItem.item.id === item.id)?.quantity || 0}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Full Menu List Section */}
        <View className='bg-white px-7 mt-1'>
          {menuSections.map(section => (
            <View key={section.id} className='mb-6'>
              <Text className='text-lg font-bold text-gray-900 mb-4'>Danh sách món ăn</Text>
              {section.items.map(item => (
                <FoodItem
                  key={item.id}
                  item={{
                    id: item.id,
                    name: item.food_name,
                    description: item.description,
                    price: item.price,
                    image: item.image ? { uri: item.image } : null,
                    time: item.time,
                    options: item.option_menu
                  }}
                  onPress={console.log('chi tiết món ăn')}
                  onAddToCart={(quantity: number) => handleAddToCart(item, quantity)}
                  quantity={cartItems.find(cartItem => cartItem.item.id === item.id)?.quantity || 0}
                  onRemoveFromCart={undefined}
                  onUpdateQuantity={undefined}
                />
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
              {formatCurrency(totalPrice.toString())}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default RestaurantDetail;
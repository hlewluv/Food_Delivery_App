import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import FoodItem from '@/components/restaurant/foodItemOx';
import { useCartStore } from '@/apis/cart/cartStore';
import { syncCartWithServer } from '@/apis/cart/cartFoodList';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash.debounce';

interface MenuItem {
  id: string;
  food_name: string;
  description: string;
  price: string | number;
  image: string;
  time?: string;
  food_type: string;
  option_menu?: Array<{
    id: string;
    option_name: string;
    price: number;
  }>;
}

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  delivery_time?: string;
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
  const [loading, setLoading] = useState(true);

  const { items, addItem, removeItem, updateQuantity, getItemsByRestaurant, getTotalItemsByRestaurant, getTotalPriceByRestaurant } = useCartStore();

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

  const featuredItems = menuItems.length > 0 ? menuItems.slice(0, 3) : [];
  useEffect(() => {
    if (menuItems.length > 0) {
      const featuredIds = featuredItems.map((item) => item.id);
      const updatedMenuItems = menuItems.filter((item) => !featuredIds.includes(item.id));
      setMenuItems(updatedMenuItems);
    }
  }, [restaurantDetails]);

  const restaurantCartItems = restaurantData?.id ? getItemsByRestaurant(restaurantData.id) : [];
  const totalItems = restaurantData?.id ? getTotalItemsByRestaurant(restaurantData.id) : 0;
  const totalPrice = restaurantData?.id ? getTotalPriceByRestaurant(restaurantData.id) : 0;

  const groupMenuItemsByCategory = () => {
    const categories = new Map<string, MenuItem[]>();
    menuItems.forEach((item) => {
      const category = item.food_type || 'Other';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)?.push(item);
    });
    return Array.from(categories.entries())
      .filter(([_, items]) => items.length > 0)
      .map(([category, items]) => ({
        id: category,
        category,
        items,
      }));
  };

  const menuSections = groupMenuItemsByCategory();

  const handleBackPress = () => {
    router.back();
  };

  const syncCartDebounced = debounce(async (cartItems: any) => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      await AsyncStorage.setItem(`pendingCartUpdates_${restaurantData?.id}`, JSON.stringify(cartItems));
      return;
    }
    try {
      await syncCartWithServer(cartItems);
    } catch (error) {
      console.error('Error syncing cart:', error);
      Alert.alert('Lỗi', 'Không thể đồng bộ giỏ hàng với server');
    }
  }, 1000);

  const handleAddToCart = (item: MenuItem, quantityChange: number) => {
    if (!restaurantData?.id) return;
    const cartItem = restaurantCartItems.find(
      (cartItem) =>
        cartItem.item.id === item.id &&
        !cartItem.specialRequest &&
        (!cartItem.selectedOptions || cartItem.selectedOptions.length === 0)
    );
    const currentQuantity = cartItem?.quantity || 0;
    const newQuantity = currentQuantity + quantityChange;

    if (newQuantity <= 0 && cartItem) {
      removeItem(item.id, restaurantData.id, '', []);
      syncCartDebounced(getItemsByRestaurant(restaurantData.id));
    } else if (cartItem) {
      updateQuantity(item.id, restaurantData.id, newQuantity, '', []);
      syncCartDebounced(getItemsByRestaurant(restaurantData.id));
    } else if (quantityChange > 0) {
      addItem({
        item: {
          id: item.id,
          name: item.food_name,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
          image: item.image ? { uri: item.image } : null,
          options: item.option_menu?.map((opt) => ({
            id: opt.id,
            option_name: opt.option_name,
            price: opt.price,
          })),
        },
        restaurantId: restaurantData.id,
        quantity: quantityChange,
        specialRequest: '',
        selectedOptions: [],
      });
      syncCartDebounced(getItemsByRestaurant(restaurantData.id));
    }
  };

  const handleViewCart = () => {
    router.push({
      pathname: '/customer/cart',
      params: {
        restaurant: JSON.stringify(restaurantData),
      },
    });
  };

  const formatCurrency = (amount: string | number) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(numericAmount);
  };

  const handleItemPress = (item: MenuItem) => {
    router.push({
      pathname: `/customer/foodDetail/[id]`,
      params: {
        id: item.id,
        food: JSON.stringify({
          id: item.id,
          name: item.food_name,
          image: item.image,
          price: item.price,
          description: item.description,
          time: item.time,
          option_menu: item.option_menu,
          restaurantName: restaurantData?.name,
          restaurantImage: restaurantData?.image,
          restaurantId: restaurantData?.id,
        }),
      },
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="mt-4 text-gray-500">Đang tải thông tin nhà hàng...</Text>
      </View>
    );
  }

  if (!restaurantData) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="mt-4 text-gray-500">Không tìm thấy thông tin nhà hàng</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} className="pb-24">
        <View className="bg-white relative">
          <Image
            source={{ uri: restaurantData.image }}
            className="w-full h-56"
            resizeMode="cover"
            blurRadius={6}
          />
          <View className="absolute top-12 left-0 right-0 flex-row justify-between px-6">
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-black/50 justify-center items-center"
              onPress={handleBackPress}
            >
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-black/50 justify-center items-center">
              <Feather name="heart" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <View className="mx-5 -mt-16 relative z-20">
            <View className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
              <View className="px-5 py-4 flex-row items-start">
                <View className="relative">
                  <Image
                    source={{ uri: restaurantData.image }}
                    className="w-24 h-24 rounded-lg mr-3 border-2 border-white shadow-lg"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1">
                  <View className="mb-2">
                    <Text className="text-2xl font-bold text-gray-900" numberOfLines={1}>
                      {restaurantData.name}
                    </Text>
                  </View>
                  <View className="mb-1">
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text className="ml-1 font-semibold text-gray-900 text-sm">
                        {restaurantData.rating.toFixed(1)}
                      </Text>
                      <Text className="ml-1 text-gray-500 text-sm">(103)</Text>
                    </View>
                    {restaurantData.delivery_time && (
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={16} color="#6b7280" />
                        <Text className="text-gray-500 text-sm ml-1">
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

        <View className="bg-white px-7 py-4 mt-4">
          <Text className="text-lg font-bold text-gray-900 mb-4">Mã giảm giá đây nèee</Text>
          <View className="mb-4 border-b border-gray-200 pb-4">
            <TouchableOpacity className="mb-3 flex-row items-center">
              <View className="bg-blue-100 p-2 rounded-lg mr-3">
                <MaterialIcons name="local-offer" size={20} color="#3b82f6" />
              </View>
              <View>
                <Text className="font-semibold text-gray-900">Đăng ký GrabUnlimited</Text>
                <Text className="text-gray-500 text-sm mt-0.5">Giảm 8.000đ giao hàng</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center">
              <View className="bg-purple-100 p-2 rounded-lg mr-3">
                <MaterialIcons name="groups" size={20} color="#8b5cf6" />
              </View>
              <View>
                <Text className="font-semibold text-gray-900">Ưu đãi đến 10%</Text>
                <Text className="text-gray-500 text-sm mt-0.5">Đặt đơn nhóm</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {restaurantCartItems.length > 0 && (
          <View className="bg-white px-4 py-4 mt-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">Giỏ hàng của {restaurantData.name}</Text>
            {restaurantCartItems.map((cartItem, index) => (
              <View
                key={`${cartItem.item.id}-${index}`}
                className="flex-row justify-between items-center py-2 border-b border-gray-200"
              >
                <View>
                  <Text className="font-medium">{cartItem.item.name}</Text>
                  {cartItem.selectedOptions && cartItem.selectedOptions.length > 0 && (
                    <Text className="text-gray-500 text-sm">
                      {cartItem.selectedOptions.map((opt) => opt.option_name).join(', ')}
                    </Text>
                  )}
                  {cartItem.specialRequest && (
                    <Text className="text-gray-500 text-sm">
                      Yêu cầu đặc biệt: {cartItem.specialRequest}
                    </Text>
                  )}
                  <Text className="text-gray-500 text-sm">
                    {formatCurrency(cartItem.item.price)} x {cartItem.quantity}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() =>
                      updateQuantity(
                        cartItem.item.id,
                        restaurantData.id,
                        cartItem.quantity - 1,
                        cartItem.specialRequest,
                        cartItem.selectedOptions ?? []
                      )
                    }
                    className="p-1"
                  >
                    <Feather name="minus" size={20} color="#6b7280" />
                  </TouchableOpacity>
                  <Text className="mx-2 font-medium">{cartItem.quantity}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      updateQuantity(
                        cartItem.item.id,
                        restaurantData.id,
                        cartItem.quantity + 1,
                        cartItem.specialRequest,
                        cartItem.selectedOptions ?? []
                      )
                    }
                    className="p-1"
                  >
                    <Feather name="plus" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {featuredItems.length > 0 && (
          <View className="bg-white px-4 mt-4">
            <Text className="text-xl font-bold text-gray-900 mb-3">Món ăn nổi bật</Text>
            <View className="flex-row flex-wrap justify-between">
              {featuredItems.map((item) => (
                <FoodItem
                  key={item.id}
                  item={{
                    id: item.id,
                    name: item.food_name,
                    description: item.description,
                    price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
                    image: item.image ? { uri: item.image } : null,
                    options: item.option_menu,
                  }}
                  onPress={() => handleItemPress(item)}
                  restaurantId={restaurantData?.id}
                  variant="featured"
                />
              ))}
            </View>
          </View>
        )}

        <View className="bg-white pb-9">
          {menuSections.map((section) => (
            <View key={section.id} className="border-b border-gray-100 last:border-0">
              <View className="px-4 pt-6 pb-2">
                <Text className="text-xl font-extrabold text-gray-900 mb-4 relative pl-3">
                  {section.category}
                  <View className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-green-500 rounded-full"></View>
                </Text>
                <View className="items-center">
                  {section.items.map((item) => (
                    <FoodItem
                      key={item.id}
                      item={{
                        id: item.id,
                        name: item.food_name,
                        description: item.description,
                        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
                        image: item.image ? { uri: item.image } : null,
                        options: item.option_menu,
                      }}
                      onPress={() => handleItemPress(item)}
                      restaurantId={restaurantData?.id}
                      variant="regular"
                    />
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {totalItems > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
          <TouchableOpacity
            className="bg-green-500 px-6 py-3 rounded-full items-center shadow-md flex-row justify-between"
            activeOpacity={0.9}
            onPress={handleViewCart}
          >
            <View className="flex-row items-center">
              <View className="bg-green-600 rounded-full w-6 h-6 justify-center items-center mr-2">
                <Text className="text-white font-bold text-sm">{totalItems}</Text>
              </View>
              <Text className="text-white font-bold text-lg">Xem giỏ hàng</Text>
            </View>
            <Text className="text-white font-bold text-lg">{formatCurrency(totalPrice)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default RestaurantDetail;
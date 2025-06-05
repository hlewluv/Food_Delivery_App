import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCartStore } from '@/apis/cart/cartStore';

interface FoodItemProps {
  item: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: { uri: string } | null;
    options?: any[];
  };
  onPress: () => void;
  restaurantId?: string;
  variant?: 'featured' | 'regular';
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 32;
const FEATURED_ITEM_WIDTH = (width - 32) / 2 - 8;

const FoodItem = ({ item, onPress, restaurantId, variant = 'regular' }: FoodItemProps) => {
  const [showQuantityControls, setShowQuantityControls] = useState(false);
  const { items, addItem, removeItem, updateQuantity } = useCartStore();

  const cartItem = items.find(cartItem => cartItem.item.id === item.id);
  const quantity = cartItem?.quantity || 0;

  useEffect(() => {
    setShowQuantityControls(quantity > 0);
  }, [quantity]);

  const handleAddPress = (e: any) => {
    e.stopPropagation();
    if (!restaurantId) {
      Alert.alert('Lỗi', 'Không tìm thấy ID nhà hàng. Vui lòng thử lại.');
      return;
    }
    addItem({
      item: {
        id: item.id,
        name: item.name,
        price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
        image: item.image,
        options: item.options,
      },
      restaurantId,
      quantity: 1,
      specialRequest: '',
      selectedOptions: [],
    });
    setShowQuantityControls(true);
  };

  const handleIncrement = (e: any) => {
    e.stopPropagation();
    if (!restaurantId) {
      Alert.alert('Lỗi', 'Không tìm thấy ID nhà hàng. Vui lòng thử lại.');
      return;
    }
    updateQuantity(item.id, restaurantId, quantity + 1, '', []);
  };

  const handleDecrement = (e: any) => {
    e.stopPropagation();
    if (!restaurantId) {
      Alert.alert('Lỗi', 'Không tìm thấy ID nhà hàng. Vui lòng thử lại.');
      return;
    }
    if (quantity > 1) {
      updateQuantity(item.id, restaurantId, quantity - 1, '', []);
    } else {
      removeItem(item.id, restaurantId);
      setShowQuantityControls(false);
    }
  };

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    })
      .format(numericPrice)
      .replace(/\s₫/, '₫');
  };

  const QuantityControls = () => (
    <View className="flex-row items-center bg-green-100 rounded-full px-2 py-1">
      <TouchableOpacity
        onPress={handleDecrement}
        activeOpacity={0.7}
        className={`w-8 h-8 justify-center items-center bg-green-500 rounded-full ${
          quantity <= 0 ? 'opacity-50' : ''
        }`}
        disabled={quantity <= 0}
      >
        <Feather name="minus" size={16} color="white" />
      </TouchableOpacity>
      <View className="w-10 justify-center items-center">
        <Text className="text-base font-bold text-gray-800">{quantity}</Text>
      </View>
      <TouchableOpacity
        onPress={handleIncrement}
        activeOpacity={0.7}
        className="w-8 h-8 justify-center items-center bg-green-500 rounded-full"
      >
        <Feather name="plus" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );

  if (variant === 'featured') {
    return (
      <TouchableOpacity
        className="bg-white rounded-xl mb-4"
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          width: FEATURED_ITEM_WIDTH,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        {item.image && (
          <View className="relative">
            <Image
              source={item.image}
              className="w-full h-32 rounded-t-xl"
              resizeMode="cover"
            />
            {item.options && item.options.length > 0 && (
              <View className="absolute top-2 right-2 bg-blue-600 rounded-full px-2 py-1">
                <Text className="text-[10px] font-bold text-white">+{item.options.length}</Text>
              </View>
            )}
          </View>
        )}
        <View className="p-3">
          <Text
            className="text-base font-bold text-gray-800 mb-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          {item.description && (
            <Text
              className="text-xs text-gray-500 mb-2"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
          )}
          <View className="flex-row justify-between items-center mt-1">
            <Text className="text-sm font-bold text-green-600">
              {formatPrice(item.price)}
            </Text>
            {showQuantityControls ? (
              <QuantityControls />
            ) : (
              <TouchableOpacity
                className="bg-green-500 px-3 py-1 rounded-full"
                activeOpacity={0.8}
                onPress={handleAddPress}
              >
                <Text className="text-xs font-semibold text-white">Thêm</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className="bg-white rounded-xl mb-4"
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        width: ITEM_WIDTH,
        shadowColor: '#4a5568',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center p-4">
        {item.image && (
          <View className="relative mr-4">
            <Image
              source={item.image}
              className="w-24 h-24 rounded-lg"
              resizeMode="cover"
            />
            {item.options && item.options.length > 0 && (
              <View className="absolute -top-2 -right-2 bg-blue-600 rounded-full px-2 py-1">
                <Text className="text-[10px] font-bold text-white">+{item.options.length}</Text>
              </View>
            )}
          </View>
        )}
        <View className="flex-1 justify-between">
          <View className="pr-2 flex-shrink">
            <Text
              className="text-lg font-bold text-gray-800 mb-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
            {item.description ? (
              <Text
                className="text-sm text-gray-500"
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{ lineHeight: 18 }}
              >
                {item.description}
              </Text>
            ) : (
              <View className="h-4" />
            )}
          </View>
          <View className="flex-row justify-between items-center mt-3">
            <Text className="text-base font-extrabold text-green-600">
              {formatPrice(item.price)}
            </Text>
            {showQuantityControls ? (
              <QuantityControls />
            ) : (
              <TouchableOpacity
                className="bg-green-500 px-4 py-2 rounded-full"
                activeOpacity={0.8}
                onPress={handleAddPress}
              >
                <Text className="text-sm font-semibold text-white">Thêm +</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FoodItem;
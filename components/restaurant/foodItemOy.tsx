import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCartStore } from '@/apis/cart/cartStore';

interface FoodItemSmallProps {
  item: {
    id: string;
    name: string;
    description?: string;
    price: string | number;
    image?: { uri: string } | null;
    time?: string;
  };
  onPress: () => void;
  onAddToCart: (quantity: number) => void;
  quantity: number;
}

const FoodItemSmall = ({ item, onPress, onAddToCart, quantity }: FoodItemSmallProps) => {
  const [showQuantityControls, setShowQuantityControls] = useState(false);
  const { items } = useCartStore();
  
  // Check if item exists in the store
  const cartItem = items.find(cartItem => cartItem.item.id === item.id);
  const storeQuantity = cartItem?.quantity || 0;
  
  // Use the store quantity if it exists and is different from prop quantity
  const displayQuantity = storeQuantity > 0 ? storeQuantity : quantity;

  useEffect(() => {
    setShowQuantityControls(displayQuantity > 0);
  }, [displayQuantity]);

  const handleAddPress = (e: any) => {
    e.stopPropagation();
    onAddToCart(1);
    setShowQuantityControls(true);
  };

  const handleIncrement = (e: any) => {
    e.stopPropagation();
    onAddToCart(1);
  };

  const handleDecrement = (e: any) => {
    e.stopPropagation();
    onAddToCart(-1);
    if (displayQuantity <= 1) {
      setShowQuantityControls(false);
    }
  };

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numericPrice);
  };

  return (
    <TouchableOpacity 
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full"
      onPress={onPress}
      activeOpacity={0.9}
    >
      {item.image && (
        <Image
          source={item.image}
          className="w-full h-32 rounded-t-lg"
          resizeMode="cover"
        />
      )}
      
      <View className="p-3">
        <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={1}>
          {item.name}
        </Text>
        
        {item.description && (
          <Text className="text-xs text-gray-500 mb-2" numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        <View className="flex-row justify-between items-center mt-auto">
          <Text className="text-sm font-semibold text-gray-900">
            {formatPrice(item.price)}
          </Text>
          
          {showQuantityControls ? (
            <View className="flex-row items-center bg-white rounded-lg shadow-sm border border-gray-200">
              <TouchableOpacity
                onPress={handleDecrement}
                activeOpacity={0.7}
                className="w-8 h-8 justify-center items-center"
              >
                <Feather name="minus" size={14} color="#6b7280" />
              </TouchableOpacity>
              
              <View className="w-6 justify-center items-center">
                <Text className="text-gray-900 font-medium">{displayQuantity}</Text>
              </View>
              
              <TouchableOpacity
                onPress={handleIncrement}
                activeOpacity={0.7}
                className="w-8 h-8 justify-center items-center"
              >
                <Feather name="plus" size={14} color="#6b7280" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              className="w-8 h-8 bg-green-500 rounded-full justify-center items-center"
              activeOpacity={0.9}
              onPress={handleAddPress}
            >
              <Feather name="plus" size={16} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FoodItemSmall;
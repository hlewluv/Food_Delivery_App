import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Ionicons, Feather } from '@expo/vector-icons'

const FoodItem = ({ 
  item, 
  onPress, 
  onAddToCart, 
  onRemoveFromCart, 
  onUpdateQuantity, 
  quantity = 0 
}) => {
  const [showQuantityControls, setShowQuantityControls] = useState(quantity > 0);

  const handleAddPress = (e) => {
    e.stopPropagation();
    onAddToCart(1);
    setShowQuantityControls(true);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    onAddToCart(1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity > 1) {
      onAddToCart(-1);
    } else {
      onRemoveFromCart();
      setShowQuantityControls(false);
    }
  };

  // Khi quantity thay đổi từ props, cập nhật showQuantityControls
  React.useEffect(() => {
    setShowQuantityControls(quantity > 0);
  }, [quantity]);

  return (
    <TouchableOpacity 
      className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View className="px-5 py-3 flex-row items-start">
        <Image
          source={item.image}
          className="w-28 h-28 rounded-lg mr-3 border border-gray-100"
          resizeMode="cover"
        />

        <View className="flex-1">
          <View className="mb-1">
            <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
            {item.description && (
              <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>

          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-base font-semibold text-gray-900">
              {item.price}
            </Text>
            
            {showQuantityControls ? (
              <View className="flex-row items-center bg-white rounded-full shadow-sm border border-gray-200">
                <TouchableOpacity
                  onPress={handleDecrement}
                  activeOpacity={0.7}
                  className="w-12 h-10 justify-center items-center"
                >
                  <Feather name="minus" size={16} color="#6b7280" />
                </TouchableOpacity>
                
                <View className="w-8 justify-center items-center">
                  <Text className="text-gray-900 font-medium">{quantity}</Text>
                </View>
                
                <TouchableOpacity
                  onPress={handleIncrement}
                  activeOpacity={0.7}
                  className="w-12 h-10 justify-center items-center"
                >
                  <Feather name="plus" size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                className="w-10 h-10 bg-green-500 rounded-full justify-center items-center"
                activeOpacity={0.9}
                onPress={handleAddPress}
              >
                <Feather name="plus" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default FoodItem
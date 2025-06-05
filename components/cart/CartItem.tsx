import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const CartItem = ({ item }) => {
  const router = useRouter();
  return (
    <>
      <View className="bg-white flex-row px-4 py-3">
        <View className="w-24 h-24 justify-center items-center">
          <Image source={{ uri: item.food.image }} className="w-full h-full" resizeMode="cover" />
        </View>
        <View className="flex-1 px-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-bold flex-1 mr-2" numberOfLines={1}>
              {item.food.name}
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/customer/foodDetail/[id]',
                  params: { id: item.food.id },
                })
              }
            >
              <Text className="text-sm font-medium text-[#00b14f] underline">Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-sm font-normal text-gray-600 mb-2" numberOfLines={2}>
            {item.food.description}
          </Text>

          {item.specialRequest && (
            <Text className="text-sm font-normal text-gray-600 italic mb-2">
              Yêu cầu đặc biệt: {item.specialRequest}
            </Text>
          )}

          {item.selectedOptions && item.selectedOptions.length > 0 && (
            <Text className="text-sm font-normal text-gray-600 mb-2">
              Tùy chọn: {item.selectedOptions.map((opt: { option_name: any; }) => opt.option_name).join(', ')}
            </Text>
          )}

          <View className="flex-row justify-between items-center">
            <Text className="text-base font-bold text-gray-800">{item.food.price}</Text>
            <Text className="text-sm font-medium text-gray-600">Số lượng: {item.quantity}</Text>
          </View>
        </View>
      </View>
      <View className="h-px bg-gray-200" />
    </>
  );
};

export default CartItem;
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import FoodHeaderInfo from '@/components/food/FoodHeaderInfo';
import SpecialRequest from '@/components/food/SpecialRequest';
import ActionBar from '@/components/food/ActionBar';
import { useCartStore } from '@/apis/cart/cartStore';
import { syncCartWithServer } from '@/apis/cart/cartFoodList';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FoodOption {
  id: string;
  option_name: string;
  price: number;
  selected?: boolean;
}

interface Food {
  id: string;
  name: string;
  image: string;
  time?: string;
  price: string;
  description: string;
  option_menu?: {
    id: string;
    option_name: string;
    price: string;
  }[];
  restaurantName?: string;
  restaurantImage?: string;
  restaurantId?: string;
}

const FoodDetail = () => {
  const router = useRouter();
  const { food } = useLocalSearchParams<{ food: string }>();
  const [quantity, setQuantity] = useState(1);
  const [specialRequest, setSpecialRequest] = useState('');

  const { addItem } = useCartStore();

  let foodData: Food | null = null;
  try {
    foodData = food ? JSON.parse(food) : null;
  } catch (error) {
    console.error('Error parsing food data:', error);
    Alert.alert('Lỗi', 'Không thể tải thông tin món ăn');
    router.back();
  }

  const [foodOptions, setFoodOptions] = useState<FoodOption[]>(
    foodData?.option_menu?.map((opt) => ({
      id: opt.id,
      option_name: opt.option_name,
      price: parseFloat(opt.price.replace(/[^0-9.-]+/g, '')) || 0,
      selected: false,
    })) || []
  );

  if (!foodData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500 text-lg mb-4">Không tìm thấy thông tin món ăn</Text>
        <TouchableOpacity
          className="bg-green-500 px-6 py-3 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const toggleFoodOption = (optionId: string) => {
    setFoodOptions((prevOptions) =>
      prevOptions.map((opt) =>
        opt.id === optionId ? { ...opt, selected: !opt.selected } : opt
      )
    );
  };

  const handleAddToCart = async () => {
    if (!foodData.restaurantId) {
      Alert.alert('Lỗi', 'Không xác định được nhà hàng');
      return;
    }

    const selectedFoodOptions = foodOptions.filter((opt) => opt.selected);
    const basePrice = parseFloat(foodData.price.replace(/[^0-9.-]+/g, '')) || 0;
    if (isNaN(basePrice)) {
      Alert.alert('Lỗi', 'Giá món ăn không hợp lệ');
      return;
    }

    const cartItem = {
      item: {
        id: foodData.id,
        name: foodData.name,
        price: basePrice,
        image: foodData.image ? { uri: foodData.image } : null,
        options: foodData.option_menu?.map((opt) => ({
          id: opt.id,
          option_name: opt.option_name,
          price: parseFloat(opt.price.replace(/[^0-9.-]+/g, '')) || 0,
        })),
      },
      quantity,
      restaurantId: foodData.restaurantId,
      specialRequest,
      selectedOptions: selectedFoodOptions,
    };

    addItem(cartItem);

    // const state = await NetInfo.fetch();
    // if (!state.isConnected) {
    //   await AsyncStorage.setItem(`pendingCartUpdates_${foodData.restaurantId}`, JSON.stringify([cartItem]));
    //   Alert.alert('Thành công', 'Đã thêm vào giỏ hàng (sẽ đồng bộ khi có mạng)');
    // } else {
    //   try {
    //     await syncCartWithServer([cartItem]);
    //     Alert.alert('Thành công', 'Đã thêm vào giỏ hàng');
    //   } catch (error) {
    //     console.error('Error syncing cart:', error);
    //     Alert.alert('Lỗi', 'Không thể đồng bộ giỏ hàng với server');
    //   }
    // }

    router.back();
  };

  const calculateTotalPrice = (): number => {
    const basePrice = parseFloat(foodData.price.replace(/[^0-9.-]+/g, '')) || 0;
    const optionsPrice = foodOptions
      .filter((opt) => opt.selected)
      .reduce((sum, opt) => sum + opt.price, 0);
    return (basePrice + optionsPrice) * quantity;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <FoodHeaderInfo
          food={{
            id: foodData.id,
            name: foodData.name,
            image: foodData.image,
            price: foodData.price,
            description: foodData.description,
            time: foodData.time,
          }}
          onBack={() => router.back()}
        />

        {foodOptions.length > 0 && (
          <View className="px-4 py-2">
            <Text className="text-lg font-bold mb-2">Tùy chọn món ăn</Text>
            {foodOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                className="flex-row items-center py-2"
                onPress={() => toggleFoodOption(option.id)}
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-3 ${
                    option.selected ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}
                >
                  {option.selected && <Feather name="check" size={14} color="white" />}
                </View>
                <View className="flex-1">
                  <Text className="font-medium">{option.option_name}</Text>
                  <Text className="text-gray-500 text-sm">{formatPrice(option.price)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <SpecialRequest value={specialRequest} onChangeText={setSpecialRequest} />
      </ScrollView>

      <ActionBar
        quantity={quantity}
        totalPrice={formatPrice(calculateTotalPrice())}
        onDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
        onIncrease={() => setQuantity((prev) => prev + 1)}
        onAddToCart={handleAddToCart}
      />
    </SafeAreaView>
  );
};

export default FoodDetail;
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CartItem from '@/components/cart/CartItem';
import PaymentMethod from '@/components/cart/PaymentMethod';
import DeliveryAddress from '@/components/cart/DeliveryAddress';
import OrderSummary from '@/components/cart/OrderSummary';
import { useCartStore } from '@/apis/cart/cartStore';
import { syncCartWithServer } from '@/apis/cart/cartFoodList';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { payment } from '@/apis/payment/payment';

interface Restaurant {
  id: string;
  name: string;
  image: string;
}

const CartScreen = () => {
  const router = useRouter();
  const { restaurant } = useLocalSearchParams<{ restaurant?: string }>();
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [address, setAddress] = useState({
    street: '79 Nguyễn Giản Thanh',
    ward: 'P.An Khê',
    district: 'Q.Thanh Khê',
    city: 'Đà Nẵng',
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null);

  const { getItemsByRestaurant, getTotalPriceByRestaurant } = useCartStore();
  // Add this to your auth API file (or create a new helper file)
  const getUserId = async (): Promise<string> => {
    try {
      const id = await AsyncStorage.getItem('id');
      if (!id) throw new Error('User not authenticated');
      return id;
    } catch (error) {
      console.error('Failed to get user ID:', error);
      throw new Error('Không thể lấy thông tin người dùng');
    }
  };
  useEffect(() => {
    if (restaurant) {
      try {
        const parsedRestaurant = JSON.parse(restaurant);
        setRestaurantData(parsedRestaurant);
      } catch (error) {
        console.error('Error parsing restaurant data:', error);
        Alert.alert('Lỗi', 'Không thể tải thông tin nhà hàng');
      }
    }
  }, [restaurant]);

  const items = restaurantData?.id ? getItemsByRestaurant(restaurantData.id) : [];

  const subtotal = items.reduce((sum, item) => {
    const basePrice = typeof item.item.price === 'string' ? parseFloat(item.item.price) : item.item.price;
    const optionsPrice = (item.selectedOptions ?? []).reduce(
      (optSum, opt) => optSum + opt.price * item.quantity,
      0
    );
    return sum + (basePrice + optionsPrice) * item.quantity;
  }, 0);
  const shippingFee = 15;
  const discount = 5;
  const total = subtotal + shippingFee - discount;

  const [paymentMethod, setPaymentMethod] = useState('zalopay');

  // Modify your handleConfirmOrder function
  const handleConfirmOrder = async () => {
    if (!restaurantData?.id) {
      Alert.alert('Lỗi', 'Không xác định được nhà hàng');
      return;
    }
  
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      await AsyncStorage.setItem(`pendingCartUpdates_${restaurantData.id}`, JSON.stringify(items));
      Alert.alert('Thông báo', 'Đơn hàng sẽ được đồng bộ khi có kết nối mạng');
      return;
    }
  
    try {
      const user_id = await getUserId();
  
      const orderData = {
        items,
        address,
        deliveryInstructions,
        paymentMethod,
        subtotal,
        shippingFee,
        discount,
        total,
        restaurantId: restaurantData.id,
        restaurantName: restaurantData.name,
        restaurantImage: restaurantData.image,
      };

      console.log(paymentMethod); 
  
      if (paymentMethod === 'zalopay') {
        const paymentPayload = {
          user_id,
          amount: total,
        };
  
        const paymentResponse = await payment(paymentPayload);
  
        if (paymentResponse?.orderurl) {
          router.push({
            pathname: '/(app)/customer/payment',
            params: {
              url: paymentResponse.orderurl,
              orderData: JSON.stringify(orderData),
            },
          });
        } else {
          throw new Error('Không nhận được URL thanh toán từ hệ thống');
        }
      } else if (paymentMethod === 'cash') {
        // Chuyển sang màn hình xác nhận không cần thanh toán
        router.push({
          pathname: '/(app)/customer/confirm',
          params: {
            orderData: JSON.stringify(orderData),
          },
        });
      }
    } catch (error) {
      console.error('Order error:', error);
      Alert.alert('Lỗi', 'Đặt đơn hàng thất bại');
    }
  };
  

  if (!restaurantData) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500 text-lg mb-4">Không tìm thấy thông tin nhà hàng</Text>
        <TouchableOpacity
          className="bg-green-500 px-6 py-3 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-white px-5 py-4">
        <Text className="text-[20px] font-bold">Giỏ hàng của {restaurantData.name}</Text>
      </View>

      {items.length > 0 ? (
        items.map((item, index) => (
          <CartItem
            key={`${item.item.id}-${index}`}
            item={{
              food: {
                id: item.item.id,
                name: item.item.name,
                image: item.item.image?.uri || 'https://example.com/placeholder.jpg',
                price: formatCurrency(
                  (typeof item.item.price === 'string' ? parseFloat(item.item.price) : item.item.price) +
                    (item.selectedOptions ?? []).reduce((sum, opt) => sum + opt.price, 0)
                ),
                restaurant: restaurantData.id,
                restaurantImage: restaurantData.image || 'https://example.com/placeholder.jpg',
                restaurantName: restaurantData.name,
              },
              quantity: item.quantity,
              specialRequest: item.specialRequest || '',
              selectedOptions: item.selectedOptions || [],
              totalPrice:
                ((typeof item.item.price === 'string' ? parseFloat(item.item.price) : item.item.price) +
                  (item.selectedOptions ?? []).reduce((sum, opt) => sum + opt.price, 0)) *
                item.quantity,
            }}
          />
        ))
      ) : (
        <View className="px-4 py-6 items-center">
          <Text className="text-gray-500 text-lg">Giỏ hàng của nhà hàng này đang trống</Text>
        </View>
      )}

      <OrderSummary
        subtotal={subtotal}
        shippingFee={shippingFee}
        discount={discount}
        total={total}
      />

      {/* <DeliveryAddress
        initialAddress={address}
        onAddressChange={(newAddress) => setAddress(newAddress)}
        onDeliveryInstructionsChange={(instructions) => setDeliveryInstructions(instructions)}
      /> */}

      <PaymentMethod
        onPaymentMethodChange={(method) => setPaymentMethod(method)}
        appliedOffersCount={2}
      />

      <View className="flex-1 bg-white">
        <ScrollView className="flex-1 pb-12">
          <View className="px-4 py-4" />
        </ScrollView>

        {items.length > 0 && (
          <View className="absolute bottom-4 left-0 right-0 px-4">
            <TouchableOpacity
              className="bg-[#00b14f] py-4 rounded-lg items-center shadow-lg"
              activeOpacity={0.8}
              onPress ={() => handleConfirmOrder()}
            >
              <Text className="text-white text-lg font-bold">
                ĐẶT ĐƠN - {formatCurrency(total)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export default CartScreen;
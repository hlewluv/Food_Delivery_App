import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Restaurant, restaurantsData } from '@/data/restaurants';

const ConfirmScreen = () => {
  const params = useLocalSearchParams();
  const orderData = typeof params.orderData === 'string' ? JSON.parse(params.orderData) : null;

  // State
  const [orderStatus, setOrderStatus] = useState('confirmed');
  const [estimatedTime, setEstimatedTime] = useState('16:15 - 16:25');
  const [statusMessage, setStatusMessage] = useState('Đang xác nhận với nhà hàng');
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<Restaurant[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [likedRestaurants, setLikedRestaurants] = useState<Record<string, boolean>>({});

  // Màu sắc
  const primaryColor = 'bg-[#00b14f]';
  const primaryTextColor = 'text-[#00b14f]';
  const grayColor = 'bg-gray-200';
  const grayTextColor = 'text-gray-500';

  // Hàm xử lý refresh
  const handleRefresh = () => {
    setRefreshing(true);
    // Làm mới danh sách nhà hàng
    const shuffled = [...restaurantsData].sort(() => 0.5 - Math.random());
    setRecommendedRestaurants(shuffled.slice(0, 3));
    setRefreshing(false);
  };

  // Hàm toggle like
  const toggleLike = (restaurantId: string) => {
    setLikedRestaurants(prev => ({
      ...prev,
      [restaurantId]: !prev[restaurantId]
    }));
  };

  // Hàm kiểm tra trạng thái
  const isStepCompleted = (step: string) => {
    const steps = ['confirmed', 'preparing', 'delivering', 'delivered'];
    return steps.indexOf(orderStatus) >= steps.indexOf(step);
  };

  // Lấy danh sách nhà hàng đề xuất
  useEffect(() => {
    handleRefresh();
  }, []);

  // Mô phỏng quá trình thay đổi trạng thái đơn hàng
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrderStatus('preparing');
      setStatusMessage('Nhà hàng đang chuẩn bị đơn hàng');
    }, 3000);

    const timer2 = setTimeout(() => {
      setOrderStatus('delivering');
      setStatusMessage('Tài xế đang trên đường đến nhà hàng');
      setEstimatedTime('16:20 - 16:30');
    }, 8000);

    const timer3 = setTimeout(() => {
      setOrderStatus('delivered');
      setStatusMessage('Đơn hàng đã giao thành công');
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Thông tin nhà hàng và đơn hàng
  const restaurantInfo = {
    name: orderData?.restaurantName || 'Cam Thổ Anh Nguyên · Phố Nhấn',
    favoriteTip: 'Lưu quán vào Mục yêu thích để đặt đơn nhanh hơn vào lần sau.'
  };

  const orderSummary = {
    total: orderData?.total || '83.000đ',
    discount: orderData?.discount || '18.000đ'
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#00b14f']}
          tintColor="#00b14f"
        />
      }
    >
      {/* Header với thông tin giao hàng */}
      <View className="bg-white px-4 py-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-lg font-bold">Giao tiết kiệm</Text>
          <Text className={`${primaryTextColor} text-sm`}>Đúng giờ</Text>
        </View>
        <Text className={`${grayTextColor} text-sm mb-2`}>{estimatedTime} · {statusMessage}</Text>
        
        {/* Thanh tiến trình */}
        <View className="mb-6 mt-2">
          <View className="flex-row justify-between items-center mb-1">
            {['confirmed', 'preparing', 'delivering', 'delivered'].map((step, index) => {
              const icons = [
                <MaterialIcons name="check" size={16} color="white" key="confirmed" />,
                <FontAwesome name="cutlery" size={16} color="white" key="preparing" />,
                <MaterialCommunityIcons name="motorbike" size={16} color="white" key="delivering" />,
                <Ionicons name="checkmark-done" size={16} color="white" key="delivered" />
              ];
              const labels = ['Xác nhận', 'Đang chuẩn bị', 'Đang giao', 'Hoàn thành'];
              
              return (
                <View key={step} className="items-center" style={{ width: 70 }}>
                  <View className={`w-8 h-8 rounded-full ${isStepCompleted(step) ? primaryColor : grayColor} justify-center items-center`}>
                    {icons[index]}
                  </View>
                  <Text className="text-xs text-center mt-1">{labels[index]}</Text>
                </View>
              );
            })}
          </View>

          {/* Đường kẻ nối các bước */}
          <View className="flex-row justify-between px-8 -mt-1">
            {[1, 2, 3].map((_, index) => (
              <View 
                key={index} 
                className={`h-1 flex-1 mx-1 ${isStepCompleted(['preparing', 'delivering', 'delivered'][index]) ? primaryColor : grayColor}`} 
              />
            ))}
          </View>
        </View>
      </View>

      {/* Khuyến mãi */}
      <View className="bg-yellow-50 px-4 py-3 border-y border-yellow-100">
        <Text className="font-bold text-yellow-800 text-sm">
          Đăng ký GrabUnlimited, nhận ngay ưu đãi 15.000đ mỗi khi đặt đơn!
        </Text>
      </View>

      {/* Thông tin nhà hàng */}
      <View className="bg-white px-4 py-3 mt-2 border-t border-b border-gray-200">
        <Text className="font-bold text-base">{restaurantInfo.name}</Text>
        <Text className={`${grayTextColor} text-sm mt-1`}>
          {restaurantInfo.favoriteTip}
        </Text>
      </View>

      {/* Tóm tắt đơn hàng */}
      <View className="bg-white px-4 py-3 mt-2">
        <View className="flex-row justify-between py-2">
          <Text className="font-bold text-base">Tổng cộng</Text>
          <Text className="font-bold text-base">{orderSummary.total}</Text>
        </View>
        <View className="flex-row justify-between py-2 border-t border-gray-100">
          <Text className={`${primaryTextColor} text-sm`}>Giảm giá</Text>
          <Text className={`${primaryTextColor} text-sm`}>{orderSummary.discount}</Text>
        </View>
        
        <TouchableOpacity className="mt-2 py-3 border-t border-gray-100">
          <Text className="text-center text-green-600 font-medium text-sm">Xem tóm tắt đơn hàng</Text>
        </TouchableOpacity>
      </View>

      {/* Gợi ý trong lúc chờ */}
      {orderStatus !== 'delivered' && (
        <View className="mt-4">
          <View className="px-6 mb-2">
            <Text className="text-2xl font-bold text-gray-900">Nhà hàng đề xuất</Text>
            <Text className="text-gray-500 mt-1">
              Các nhà hàng phù hợp với sở thích của bạn
            </Text>
          </View>
        </View>
      )}

      {/* Thông báo khi giao hàng thành công */}
      {orderStatus === 'delivered' && (
        <View className="bg-white px-4 py-4 mt-2 mb-4">
          <Text className="text-center font-bold text-lg mb-2">Đơn hàng đã giao thành công!</Text>
          <Text className="text-center text-gray-600 mb-3">Cảm ơn bạn đã sử dụng dịch vụ</Text>
          <TouchableOpacity className="bg-green-600 py-3 rounded-lg">
            <Text className="text-center text-white font-medium">Đánh giá đơn hàng</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default ConfirmScreen;
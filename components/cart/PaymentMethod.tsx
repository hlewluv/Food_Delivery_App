import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

const PaymentMethod = ({ onPaymentMethodChange, appliedOffersCount = 0 }) => {
  const [selectedMethod, setSelectedMethod] = useState('zalopay');

  const paymentMethods = [
    {
      id: 'zalopay',
      name: 'Zalopay ***9479',
      icon: <FontAwesome name="credit-card" size={19} color="#00b14f" />
    },
    {
      id: 'cash',
      name: 'Tiền mặt',
      icon: <MaterialCommunityIcons name="cash-multiple" size={20} color="#00b14f" />
    }
  ];

  const handleSelectMethod = (methodId) => {
    setSelectedMethod(methodId);
    onPaymentMethodChange(methodId);
  };

  return (
    <View className="bg-white rounded-lg px-5 py-4 mt-2 shadow-sm">
      <Text className="text-lg font-bold text-gray-800 mb-4">Thông tin thanh toán</Text>

      {/* Phương thức thanh toán */}
      <View className="mb-3">
        <Text className="text-sm font-medium text-gray-500 mb-2">
          CHỌN PHƯƠNG THỨC THANH TOÁN
        </Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            className="flex-row items-center justify-between py-3"
            activeOpacity={0.7}
            onPress={() => handleSelectMethod(method.id)}
          >
            <View className="flex-row items-center">
              <View className="w-5 h-5 rounded-full border border-gray-300 mr-3 justify-center items-center">
                <View 
                  className={`w-3 h-3 rounded-full ${selectedMethod === method.id ? 'bg-green-500' : 'bg-gray-200'}`} 
                />
              </View>
              {method.icon}
              <Text className="ml-2 text-base font-medium text-gray-700">{method.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-gray-100 my-3" />

      {/* Ưu đãi */}
      <View>
        <Text className="text-lg font-bold text-gray-800 mb-3">Ưu đãi</Text>
        <TouchableOpacity
          className="flex-row items-center justify-between py-2"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <MaterialIcons name="discount" size={20} color="#00b14f" />
            <Text className="ml-2 text-base font-medium text-gray-700">
              Đã áp dụng {appliedOffersCount} ưu đãi
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-sm font-medium text-green-500 mr-1">Xem tất cả</Text>
            <Feather name="chevron-right" size={16} color="#00b14f" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

PaymentMethod.defaultProps = {
  onPaymentMethodChange: () => {},
  appliedOffersCount: 0
};

export default PaymentMethod;
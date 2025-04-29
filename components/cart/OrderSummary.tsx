import React from 'react';
import { View, Text } from 'react-native';

const OrderSummary = ({ subtotal, shippingFee, discount, total }) => {
  return (
    <View className='bg-white px-5 py-4 mt-2'>
      <Text className='text-[17px] font-bold mb-3'>Tóm tắt thanh toán</Text>
      <View className='flex-row justify-between mb-2'>
        <Text className='text-[14px] font-medium text-gray-600'>Tạm tính:</Text>
        <Text className='text-[14px] font-medium'>{subtotal}.000đ</Text>
      </View>
      <View className='flex-row justify-between mb-2'>
        <Text className='text-[14px] font-medium text-gray-600'>Phí vận chuyển:</Text>
        <Text className='text-[14px] font-medium'>{shippingFee}.000đ</Text>
      </View>
      <View className='flex-row justify-between mb-2'>
        <Text className='text-[14px] font-medium text-gray-600'>Giảm giá:</Text>
        <Text className='text-[14px] font-medium text-[#00b14f]'>-{discount}.000đ</Text>
      </View>

      <View className='h-[1px] bg-gray-200 my-3' />

      <View className='flex-row justify-between'>
        <Text className='text-[17px] font-bold'>Tổng cộng:</Text>
        <Text className='text-[17px] font-bold text-[#00b14f]'>{total}.000đ</Text>
      </View>
    </View>
  );
};

export default OrderSummary;
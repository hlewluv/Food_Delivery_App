import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';

const DeliveryAddress = ({ 
  initialAddress = {
    street: '',
    ward: '',
    district: '',
    city: '',
  }, 
  onAddressChange = (address: { street: string; ward: string; district: string; city: string; }) => {}, 
  onDeliveryInstructionsChange = (text: any) => {} 
}) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState(initialAddress);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  const handleSaveAddress = () => {
    setIsEditingAddress(false);
    onAddressChange(address);
  };

  const handleDeliveryInstructionsChange = (text: React.SetStateAction<string>) => {
    setDeliveryInstructions(text);
    onDeliveryInstructionsChange(text);
  };

  return (
    <View className='bg-white px-5 py-4 mt-2'>
      <View className='flex-row justify-between items-center mb-3'>
        <View className='flex-row items-center'>
          <Feather name='map-pin' size={18} color='#00b14f' />
          <Text className='text-[17px] font-bold ml-2'>Địa chỉ giao hàng</Text>
        </View>
        <TouchableOpacity
          onPress={isEditingAddress ? handleSaveAddress : () => setIsEditingAddress(true)}
          className='flex-row items-center'
        >
          <MaterialIcons name={isEditingAddress ? 'check' : 'edit'} size={18} color='#00b14f' />
          <Text className='text-[14px] font-medium text-[#00b14f] ml-1'>
            {isEditingAddress ? 'Xong' : 'Chỉnh sửa'}
          </Text>
        </TouchableOpacity>
      </View>

      {isEditingAddress ? (
        <View>
          <TextInput
            className='border border-gray-300 rounded-lg p-3 mb-2 text-[14px] font-normal'
            placeholder='Số nhà, tên đường'
            value={address.street}
            onChangeText={text => setAddress({ ...address, street: text })}
          />
          <View className='flex-row mb-2'>
            <TextInput
              className='flex-1 border border-gray-300 rounded-lg p-3 mr-2 text-[14px] font-normal'
              placeholder='Phường/Xã'
              value={address.ward}
              onChangeText={text => setAddress({ ...address, ward: text })}
            />
            <TextInput
              className='flex-1 border border-gray-300 rounded-lg p-3 text-[14px] font-normal'
              placeholder='Quận/Huyện'
              value={address.district}
              onChangeText={text => setAddress({ ...address, district: text })}
            />
          </View>
          <TextInput
            className='border border-gray-300 rounded-lg p-3 text-[14px] font-normal'
            placeholder='Thành phố/Tỉnh'
            value={address.city}
            onChangeText={text => setAddress({ ...address, city: text })}
          />
        </View>
      ) : (
        <View className='mb-3'>
          <Text className='text-[14px] font-medium'>{address.street}</Text>
          <Text className='text-[14px] font-normal text-gray-600 mt-1'>
            {address.ward}, {address.district}, {address.city}
          </Text>
        </View>
      )}

      <View className='h-[1px] bg-gray-200 my-3' />

      <View className='flex-row items-start'>
        <Ionicons name='document-text-outline' size={18} color='#00b14f' className='mt-2' />
        <TextInput
          className='flex-1 ml-2 text-[14px] font-normal bg-gray-50 rounded-lg min-h-10 border border-gray-200 px-3 py-2'
          placeholder='Thêm chi tiết địa chỉ và hướng dẫn giao hàng'
          placeholderTextColor='#9ca3af'
          multiline
          value={deliveryInstructions}
          onChangeText={handleDeliveryInstructionsChange}
          textAlignVertical='top'
        />
      </View>
    </View>
  );
};

export default DeliveryAddress;
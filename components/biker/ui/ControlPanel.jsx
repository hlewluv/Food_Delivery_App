import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ControlPanel = ({ isConnected, toggleConnection, handleCenterMap }) => (
  <View className='absolute bottom-4 w-full px-4'>
    <TouchableOpacity
      className={`rounded-full py-3 px-6 flex-row justify-center items-center shadow-lg mb-4 mx-auto ${isConnected ? 'bg-red-500' : 'bg-[#404341]'}`}
      activeOpacity={0.8}
      style={{ width: 'auto' }}
      onPress={toggleConnection}>
      <Ionicons name='power-outline' size={20} color='#fff' />
      <Text className='text-white font-bold ml-2 text-sm'>
        {isConnected ? 'TẮT KẾT NỐI' : 'BẬT KẾT NỐI'}
      </Text>
    </TouchableOpacity>

    <View className='flex-row justify-between bg-white rounded-full px-6 py-3 shadow-md'>
      {[
        { icon: 'location-outline', label: 'Lưu vị trí' },
        { icon: 'navigate-outline', label: 'Định vị', action: handleCenterMap },
        { icon: 'information-circle-outline', label: 'Trung tâm' },
        { icon: 'call-outline', label: 'Gọi Now' }
      ].map((item, index) => (
        <TouchableOpacity
          key={index}
          className='items-center'
          onPress={item.action}
          activeOpacity={0.7}>
          <View className='bg-gray-100 p-2 rounded-full'>
            <Ionicons name={item.icon} size={20} color='#333' />
          </View>
          <Text className='text-xs mt-1 text-gray-700'>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default ControlPanel;
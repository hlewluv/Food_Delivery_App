import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const AddOption = () => {
  const [groupName, setGroupName] = useState('');
  
  const [options, setOptions] = useState([]);
  
  const [newOption, setNewOption] = useState('');
  const [newOptionPrice, setNewOptionPrice] = useState('');

  const handleAddOption = () => {
    if (!newOption.trim()) {
      alert('Vui lòng nhập tên tùy chọn');
      return;
    }
    if (!newOptionPrice.trim()) {
      alert('Vui lòng nhập giá tiền cho tùy chọn');
      return;
    }
    if (isNaN(newOptionPrice) || parseFloat(newOptionPrice) < 0) {
      alert('Giá tiền phải là một số hợp lệ và không âm');
      return;
    }

    setOptions([...options, { name: newOption.trim(), price: newOptionPrice.trim() }]);
    setNewOption(''); // Clear input after adding
    setNewOptionPrice(''); // Clear price input after adding
  };

  // Function to handle form submission (linking the option group)
  const handleSubmit = () => {
    if (!groupName.trim()) {
      alert('Vui lòng nhập tên nhóm tùy chọn');
      return;
    }
    if (options.length === 0) {
      alert('Vui lòng thêm ít nhất một tùy chọn');
      return;
    }

    // Simulate submitting the data (you can replace this with an API call)
    console.log('Option Group Data:', { groupName, options });

    // Navigate back or to another screen after submission
    router.back();
  };

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Scrollable Content */}
      <ScrollView className='flex-1' contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header with Back Button */}
        <View className='flex-row items-center p-5 bg-white border-b border-gray-200 shadow-sm'>
          <TouchableOpacity onPress={() => router.back()} className='mr-4'>
            <Ionicons name='arrow-back' size={28} color='gray' />
          </TouchableOpacity>
          <Text className='flex-1 text-center text-2xl font-bold text-gray-900 mr-8'>
            Tạo nhóm tùy chọn mới
          </Text>
        </View>

        {/* Option Group Name Section */}
        <View className='p-5 mx-4 my-4 bg-white rounded-xl shadow-sm'>
          <Text className='text-lg font-semibold text-gray-800 mb-3'>Tên nhóm tùy chọn</Text>
          <TextInput
            className='border border-gray-300 rounded-lg p-4 text-base bg-gray-50'
            style={{ height: 56 }}
            placeholder='VD: Topping, kích cỡ, lượng đường'
            placeholderTextColor='#9CA3AF'
            value={groupName}
            onChangeText={setGroupName}
          />
        </View>

        {/* Options Section */}
        <View className='p-5 mx-4 my-4 bg-white rounded-xl shadow-sm'>
          <Text className='text-lg font-semibold text-gray-800 mb-3'>Tùy chọn</Text>
          <View className='flex-row items-center mb-4'>
            <TextInput
              className='flex-1 border border-gray-300 rounded-lg p-4 text-base bg-gray-50 mr-3'
              style={{ height: 56 }}
              placeholder='VD: Trân châu, 100% đường'
              placeholderTextColor='#9CA3AF'
              value={newOption}
              onChangeText={setNewOption}
            />
            <TextInput
              className='w-1/3 border border-gray-300 rounded-lg p-4 text-base bg-gray-50'
              style={{ height: 56 }}
              placeholder='Giá (VNĐ)'
              placeholderTextColor='#9CA3AF'
              value={newOptionPrice}
              onChangeText={setNewOptionPrice}
              keyboardType='numeric'
            />
          </View>
          <TouchableOpacity onPress={handleAddOption}>
            <Text className='text-blue-600 font-semibold text-base'>Thêm một tùy chọn</Text>
          </TouchableOpacity>
        </View>

        {/* Option Details Section */}
        <View className='p-5 mx-4 my-4 bg-white rounded-xl shadow-sm'>
          <Text className='text-lg font-semibold text-gray-800 mb-3'>Chi tiết tùy chọn</Text>
          {options.length === 0 ? (
            <Text className='text-gray-500 text-center py-4'>
              Chưa có tùy chọn, bạn có thể bắt đầu
            </Text>
          ) : (
            options.map((option, index) => (
              <View
                key={index}
                className='flex-row justify-between items-center py-3 px-4 mb-2 bg-gray-50 rounded-lg'>
                <View>
                  <Text className='text-gray-800 font-medium'>{option.name}</Text>
                  <Text className='text-gray-600 text-sm'>{option.price} VNĐ</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setOptions(options.filter((_, i) => i !== index))}>
                  <Ionicons name='trash-outline' size={20} color='red' />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Fixed Submit Button at Bottom */}
      <View className='bg-white border-t border-gray-200 p-4 shadow-md'>
        <TouchableOpacity
          onPress={handleSubmit}
          className='bg-green-600 p-4 rounded-lg items-center justify-center'>
          <Text className='text-white text-lg font-semibold'>Liên kết nhóm tùy chọn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddOption;
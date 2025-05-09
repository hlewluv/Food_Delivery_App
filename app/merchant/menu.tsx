import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you have expo icons installed

const MenuScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Có sẵn');
  const [showOptions, setShowOptions] = useState(false);

  const categories = [
    { name: 'Đặc sản/Món khó', count: 3 },
    { name: 'Ăn Vặt', count: 6 },
  ];

  const handleSetupMenuPress = () => {
    setShowOptions(true);
  };

  const handleBackPress = () => {
    setShowOptions(false);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header with Back Button and Centered Title */}
      <View className="flex-row items-center p-5 bg-white">
        <TouchableOpacity onPress={handleBackPress} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="gray" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-2xl font-semibold text-gray-800">Thực đơn</Text>
      </View>

      {/* Có sẵn and Số liệu Tabs */}
      <View className="flex-row border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 p-3 pb-3 ${selectedTab === 'Có sẵn' ? 'border-b-2 border-green-600' : ''}`}
          onPress={() => setSelectedTab('Có sẵn')}>
          <Text className={`text-center font-medium text-xl ${selectedTab === 'Có sẵn' ? 'text-green-600' : 'text-gray-800'}`}>Có sẵn</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 p-3 pb-3 ${selectedTab === 'Số liệu' ? 'border-b-2 border-green-600' : ''}`}
          onPress={() => setSelectedTab('Số liệu')}>
          <Text className={`text-center font-medium text-xl ${selectedTab === 'Số liệu' ? 'text-green-600' : 'text-gray-800'}`}>Số liệu</Text>
        </TouchableOpacity>
      </View>

      {/* Thiết lập thực đơn Section */}
      {selectedTab === 'Có sẵn' && (
        <TouchableOpacity onPress={handleSetupMenuPress} className="flex-row items-center p-5 mx-4 my-2 bg-white rounded-lg shadow-sm">
          <Image
            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROn0ZCB0AvToYOVfoun4eG5ItZxXuLO6SHWIFCQOZa8GtocASVAbWTmUxrEd0X9DZOKfM&usqp=CAU' }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <Text className="text-xl text-gray-800">Thiết lập thực đơn</Text>
          <Ionicons name="chevron-forward" size={28} color="gray" className="ml-auto" />
        </TouchableOpacity>
      )}

      {/* Categories Section */}
      {selectedTab === 'Có sẵn' && (
        <View className="px-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl font-semibold text-gray-800">Menu 1 (2 Danh mục)</Text>
            <TouchableOpacity className="bg-green-600 px-5 py-2 rounded-full">
              <Text className="text-white font-medium text-lg">Chọn</Text>
            </TouchableOpacity>
          </View>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row justify-between items-center p-5 mb-4 bg-white rounded-lg shadow-sm">
              <Text className="text-lg text-gray-800">{category.name}</Text>
              <View className="flex-row items-center">
                <Text className="text-lg text-gray-600 mr-3">{category.count} món</Text>
                <Ionicons name="chevron-forward" size={28} color="gray" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal for Options with Darkened Background */}
      <Modal
        transparent={true}
        visible={showOptions}
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}>
        <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
          <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <TouchableWithoutFeedback>
              <View className="bg-white p-4 rounded-t-2xl">
                <TouchableOpacity className="p-4 mb-2 bg-gray-100 rounded-lg">
                  <Text className="text-lg text-gray-800">Thêm món ăn</Text>
                </TouchableOpacity>
                <TouchableOpacity className="p-4 bg-gray-100 rounded-lg">
                  <Text className="text-lg text-gray-800">Danh mục (chứa nhiều món ăn cùng loại)</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

export default MenuScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ProfileModal = ({ visible, onClose, restaurant }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <View className="bg-white p-4 rounded-2xl w-1/2 shadow-lg">
              <Text className="text-xl font-bold text-gray-900 mb-3">Hồ sơ quán</Text>
              
              {/* Restaurant Image */}
              <Image
                source={{ uri: restaurant.image }}
                className="w-full h-32 rounded-xl mb-3 border border-gray-200 shadow-md"
                resizeMode="cover"
              />
              
              {/* Restaurant Name */}
              <View className="mb-3">
                <Text className="text-base font-semibold text-gray-800">Tên quán</Text>
                <Text className="text-gray-600 text-sm">{restaurant.name}</Text>
              </View>
              
              {/* Establishment Date */}
              <View className="mb-3">
                <Text className="text-base font-semibold text-gray-800">Ngày thành lập</Text>
                <Text className="text-gray-600 text-sm">{restaurant.established || '01/01/2020'}</Text>
              </View>
              
              {/* Rating */}
              <View className="mb-3">
                <Text className="text-base font-semibold text-gray-800">Đánh giá</Text>
                <View className="flex-row items-center">
                  {[...Array(5)].map((_, index) => (
                    <Ionicons
                      key={index}
                      name={index < (restaurant.rating || 4) ? 'star' : 'star-outline'}
                      size={16}
                      color="#FFD700"
                    />
                  ))}
                  <Text className="ml-1 text-gray-600 text-sm">
                    {restaurant.rating || 4}.0 ({restaurant.reviews || 120} lượt đánh giá)
                  </Text>
                </View>
              </View>
              
              {/* Services */}
              <View className="mb-3">
                <Text className="text-base font-semibold text-gray-800">Dịch vụ</Text>
                <Text className="text-gray-600 text-sm">{restaurant.services}</Text>
              </View>
              
              {/* Close Button */}
              <TouchableOpacity
                onPress={onClose}
                className="bg-[#00b14f] px-4 py-2 rounded-full mt-3"
                accessibilityLabel="Đóng hồ sơ"
              >
                <Text className="text-white font-semibold text-center text-sm">Đóng</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const ProfileScreen = () => {
  const [restaurant, setRestaurant] = useState({
    name: 'Coffee Cafe, Ho Chi Minh',
    image:
      'https://cafefcdn.com/thumb_w/640/203337114487263232/2025/2/21/avatar1740096715584-17400967157451708166300.jpg',
    address: '34 Le Duan Street, Ho Chi Minh City, Vietnam',
    phone: '+84 8 38',
    email: 'contact@coffeecafe.com',
    services: 'GrabFood • GrabPay',
    established: '01/01/2020',
    rating: 4,
    reviews: 120,
    workingHours: {
      Monday: '07:00 - 22:00',
      Tuesday: '07:00 - 22:00',
      Wednesday: '07:00 - 22:00',
      Thursday: '07:00 - 22:00',
      Friday: '07:00 - 13:00',
    },
  });

  // Modal visibility states
  const [workingHoursModalVisible, setWorkingHoursModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // Temporary form data states
  const [tempWorkingHours, setTempWorkingHours] = useState(restaurant.workingHours);
  const [tempPhone, setTempPhone] = useState(restaurant.phone);
  const [tempEmail, setTempEmail] = useState(restaurant.email);
  const [tempAddress, setTempAddress] = useState(restaurant.address);

  const handleCall = () => {
    Linking.openURL(`tel:${restaurant.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${restaurant.email}`);
  };

  const handleMap = () => {
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`
    );
  };

  // Handle Working Hours Save
  const handleSaveWorkingHours = () => {
    setRestaurant((prev) => ({
      ...prev,
      workingHours: { ...tempWorkingHours },
    }));
    setWorkingHoursModalVisible(false);
  };

  // Handle Contact Save
  const handleSaveContact = () => {
    setRestaurant((prev) => ({
      ...prev,
      phone: tempPhone,
      email: tempEmail,
    }));
    setContactModalVisible(false);
  };

  // Handle Address Save
  const handleSaveAddress = () => {
    setRestaurant((prev) => ({
      ...prev,
      address: tempAddress,
    }));
    setAddressModalVisible(false);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header Image */}
      <View className="relative">
        <Image source={{ uri: restaurant.image }} className="w-full h-48" resizeMode="cover" />
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-5 left-5 bg-white rounded-full p-2"
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={24} color="#00b14f" />
        </TouchableOpacity>
      </View>

      <View className="mx-5 -mt-16 relative z-20">
        <View className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
          <View className="px-6 py-4 flex-row items-center justify-between">
            {/* Image on the left */}
            <Image
              source={{ uri: restaurant.image }}
              className="w-20 h-20 rounded-lg border-2 border-gray-200 shadow-sm"
              resizeMode="cover"
            />
            {/* Name, services, and button on the right */}
            <View className="flex-col flex-1 ml-4">
              <Text className="text-xl font-bold text-gray-900">{restaurant.name}</Text>
              {restaurant.services && <Text className="text-gray-500">{restaurant.services}</Text>}
            </View>
            <TouchableOpacity
              className="px-3 py-2 bg-white rounded-full border border-gray-300 self-start shadow-sm active:bg-gray-50"
              onPress={() => setProfileModalVisible(true)}
            >
              <Text className="text-gray-700 font-medium text-sm">Hồ sơ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Working Hours */}
      <View className="p-5">
        <View className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={20} color="#00b14f" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">Giờ hoạt động</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setTempWorkingHours(restaurant.workingHours);
                setWorkingHoursModalVisible(true);
              }}
              className="p-2"
              accessibilityLabel="Chỉnh sửa giờ hoạt động"
            >
              <Ionicons name="pencil-outline" size={20} color="#00b14f" />
            </TouchableOpacity>
          </View>
          {Object.entries(restaurant.workingHours).map(([day, time]) => (
            <View
              key={day}
              className="flex-row justify-between py-2 border-b border-gray-200 last:border-b-0"
            >
              <Text className="text-gray-600">{day}</Text>
              <Text className="text-gray-800">{time}</Text>
            </View>
          ))}
        </View>

        {/* Contact */}
        <View className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Ionicons name="call-outline" size={20} color="#00b14f" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">Liên lạc</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setTempPhone(restaurant.phone);
                setTempEmail(restaurant.email);
                setContactModalVisible(true);
              }}
              className="p-2"
              accessibilityLabel="Chỉnh sửa thông tin liên lạc"
            >
              <Ionicons name="pencil-outline" size={20} color="#00b14f" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleCall} className="flex-row items-center py-2">
            <Ionicons name="phone-portrait-outline" size={18} color="#00b14f" />
            <Text className="text-gray-800 ml-2">{restaurant.phone}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEmail} className="flex-row items-center py-2">
            <Ionicons name="mail-outline" size={18} color="#00b14f" />
            <Text className="text-gray-800 ml-2">{restaurant.email}</Text>
          </TouchableOpacity>
        </View>

        {/* Address */}
        <View className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={20} color="#00b14f" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">Địa chỉ</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setTempAddress(restaurant.address);
                setAddressModalVisible(true);
              }}
              className="p-2"
              accessibilityLabel="Chỉnh sửa địa chỉ"
            >
              <Ionicons name="pencil-outline" size={20} color="#00b14f" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleMap} className="flex-row items-center py-2">
            <Ionicons name="map-outline" size={18} color="#00b14f" />
            <Text className="text-gray-800 ml-2">{restaurant.address}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Modal */}
      <ProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        restaurant={restaurant}
      />

      {/* Working Hours Modal */}
      <Modal
        transparent={true}
        visible={workingHoursModalVisible}
        animationType="fade"
        onRequestClose={() => setWorkingHoursModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setWorkingHoursModalVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <TouchableWithoutFeedback>
              <View className="bg-white p-6 rounded-2xl w-11/12">
                <Text className="text-2xl font-bold text-gray-900 mb-4">Chỉnh sửa giờ hoạt động</Text>
                {Object.entries(tempWorkingHours).map(([day, time]) => (
                  <View key={day} className="mb-4">
                    <Text className="text-gray-600 mb-1">{day}</Text>
                    <TextInput
                      className="border border-gray-300 p-3 rounded-lg bg-white"
                      value={time}
                      onChangeText={(text) =>
                        setTempWorkingHours((prev) => ({ ...prev, [day]: text }))
                      }
                      placeholder="VD: 07:00 - 22:00"
                      accessibilityLabel={`Giờ hoạt động ngày ${day}`}
                    />
                  </View>
                ))}
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    onPress={handleSaveWorkingHours}
                    className="bg-[#00b14f] px-6 py-3 rounded-full flex-1 mr-2"
                    accessibilityLabel="Lưu giờ hoạt động"
                  >
                    <Text className="text-white font-semibold text-center">Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setWorkingHoursModalVisible(false)}
                    className="bg-gray-500 px-6 py-3 rounded-full flex-1 ml-2"
                    accessibilityLabel="Hủy chỉnh sửa giờ hoạt động"
                  >
                    <Text className="text-white font-semibold text-center">Hủy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Contact Modal */}
      <Modal
        transparent={true}
        visible={contactModalVisible}
        animationType="fade"
        onRequestClose={() => setContactModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setContactModalVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <TouchableWithoutFeedback>
              <View className="bg-white p-6 rounded-2xl w-11/12">
                <Text className="text-2xl font-bold text-gray-900 mb-4">Chỉnh sửa thông tin liên lạc</Text>
                <Text className="text-gray-600 mb-1">Số điện thoại:</Text>
                <TextInput
                  className="border border-gray-300 p-3 rounded-lg bg-white mb-4"
                  value={tempPhone}
                  onChangeText={setTempPhone}
                  placeholder="VD: +84 8 38 123 456"
                  keyboardType="phone-pad"
                  accessibilityLabel="Số điện thoại"
                />
                <Text className="text-gray-600 mb-1">Email:</Text>
                <TextInput
                  className="border border-gray-300 p-3 rounded-lg bg-white mb-4"
                  value={tempEmail}
                  onChangeText={setTempEmail}
                  placeholder="VD: contact@coffeecafe.com"
                  keyboardType="email-address"
                  accessibilityLabel="Email"
                />
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    onPress={handleSaveContact}
                    className="bg-[#00b14f] px-6 py-3 rounded-full flex-1 mr-2"
                    accessibilityLabel="Lưu thông tin liên lạc"
                  >
                    <Text className="text-white font-semibold text-center">Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setContactModalVisible(false)}
                    className="bg-gray-500 px-6 py-3 rounded-full flex-1 ml-2"
                    accessibilityLabel="Hủy chỉnh sửa thông tin liên lạc"
                  >
                    <Text className="text-white font-semibold text-center">Hủy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Address Modal */}
      <Modal
        transparent={true}
        visible={addressModalVisible}
        animationType="fade"
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setAddressModalVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <TouchableWithoutFeedback>
              <View className="bg-white p-6 rounded-2xl w-11/12">
                <Text className="text-2xl font-bold text-gray-900 mb-4">Chỉnh sửa địa chỉ</Text>
                <Text className="text-gray-600 mb-1">Địa chỉ:</Text>
                <TextInput
                  className="border border-gray-300 p-3 rounded-lg bg-white mb-4"
                  value={tempAddress}
                  onChangeText={setTempAddress}
                  placeholder="VD: 34 Le Duan Street, Ho Chi Minh City, Vietnam"
                  accessibilityLabel="Địa chỉ"
                />
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    onPress={handleSaveAddress}
                    className="bg-[#00b14f] px-6 py-3 rounded-full flex-1 mr-2"
                    accessibilityLabel="Lưu địa chỉ"
                  >
                    <Text className="text-white font-semibold text-center">Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setAddressModalVisible(false)}
                    className="bg-gray-500 px-6 py-3 rounded-full flex-1 ml-2"
                    accessibilityLabel="Hủy chỉnh sửa địa chỉ"
                  >
                    <Text className="text-white font-semibold text-center">Hủy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;
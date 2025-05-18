import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Schedule, Staff, shiftOptions } from '@/components/merchant/staff/types';

interface AddStaffModalProps {
  visible: boolean;
  setShowAddStaffModal: (value: boolean) => void;
  setStaffList: React.Dispatch<React.SetStateAction<Staff[]>>;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  permissionStatus: 'granted' | 'denied' | null;
  setFilterDay: (value: keyof Schedule | 'all') => void;
}

const AddStaffModal: React.FC<AddStaffModalProps> = ({
  visible,
  setShowAddStaffModal,
  setStaffList,
  isLoading,
  setIsLoading,
  permissionStatus,
  setFilterDay,
}) => {
  const [newStaffData, setNewStaffData] = useState<Staff>({
    id: '',
    name: '',
    role: 'waiter',
    phone: '',
    schedule: {
      monday: 'Nghỉ',
      tuesday: 'Nghỉ',
      wednesday: 'Nghỉ',
      thursday: 'Nghỉ',
      friday: 'Nghỉ',
      saturday: 'Nghỉ',
      sunday: 'Nghỉ',
    },
    image: null,
    status: 'approved',
    workStatus: 'no-schedule',
  });

  const pickImage = async () => {
    if (permissionStatus !== 'granted') {
      Alert.alert(
        'Quyền truy cập bị từ chối',
        'Vui lòng cấp quyền truy cập thư viện ảnh trong cài đặt thiết bị.',
        [{ text: 'OK' }]
      );
      return;
    }
    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setNewStaffData({ ...newStaffData, image: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi chọn ảnh.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    console.log('Validating inputs:', newStaffData);
    if (!newStaffData.name.trim()) {
      console.log('Validation failed: Empty name');
      Alert.alert('Lỗi', 'Tên nhân viên không được để trống.');
      return false;
    }
    if (!newStaffData.phone.match(/^\d{10}$/)) {
      console.log('Validation failed: Invalid phone number', newStaffData.phone);
      Alert.alert('Lỗi', 'Số điện thoại phải có đúng 10 chữ số.');
      return false;
    }
    const workingDays = Object.values(newStaffData.schedule).filter((shift) => shift !== 'Nghỉ').length;
    if (workingDays < 3) {
      console.log('Validation failed: Fewer than 3 working days', workingDays);
      Alert.alert('Lỗi', 'Phải có ít nhất 3 ngày làm việc (khác Nghỉ).');
      return false;
    }
    return true;
  };

  const handleAddStaff = () => {
    console.log('handleAddStaff called with data:', newStaffData);
    if (!validateInputs()) {
      return;
    }
    setIsLoading(true);
    try {
      const currentDay = new Date().getDay();
      const days: (keyof Schedule)[] = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      const currentDayKey = days[currentDay];
      // Generate next ID by finding max existing ID and incrementing
      let newId: string;
      setStaffList((prev) => {
        const ids = prev.map((staff) => parseInt(staff.id, 10)).filter((id) => !isNaN(id));
        const maxId = Math.max(...ids, 0);
        newId = (maxId + 1).toString();
        const newStaff: Staff = {
          id: newId,
          name: newStaffData.name.trim(),
          role: newStaffData.role,
          phone: newStaffData.phone,
          schedule: { ...newStaffData.schedule },
          image: newStaffData.image,
          status: 'approved',
          workStatus:
            newStaffData.schedule[currentDayKey] && newStaffData.schedule[currentDayKey] !== 'Nghỉ'
              ? 'working'
              : 'no-schedule',
        };
        const updatedList = [...prev, newStaff];
        console.log('Added staff:', newStaff);
        console.log('Updated staffList:', updatedList);
        return updatedList;
      });
      setFilterDay('all');
      setShowAddStaffModal(false);
      setNewStaffData({
        id: '',
        name: '',
        role: 'waiter',
        phone: '',
        schedule: {
          monday: 'Nghỉ',
          tuesday: 'Nghỉ',
          wednesday: 'Nghỉ',
          thursday: 'Nghỉ',
          friday: 'Nghỉ',
          saturday: 'Nghỉ',
          sunday: 'Nghỉ',
        },
        image: null,
        status: 'approved',
        workStatus: 'no-schedule',
      });
      setTimeout(() => {
        setIsLoading(false);
        console.log('Cleared isLoading after adding staff');
      }, 100);
    } catch (error) {
      console.error('Error creating staff:', error);
      Alert.alert('Lỗi', 'Không thể thêm nhân viên. Vui lòng thử lại.');
      setIsLoading(false);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={() => {
        setShowAddStaffModal(false);
        setIsLoading(false);
      }}
    >
      <View className="flex-1 bg-black/50">
        <TouchableWithoutFeedback
          onPress={() => {
            setShowAddStaffModal(false);
            setIsLoading(false);
          }}
        >
          <View className="flex-1 justify-center items-center">
            <TouchableWithoutFeedback>
              <View
                className="bg-white rounded-lg overflow-hidden"
                style={{ width: 620, maxWidth: '90%', maxHeight: '90%' }}
              >
                <View className="p-5 border-b border-gray-200">
                  <Text className="text-lg font-semibold text-gray-800">
                    Thêm Nhân viên Mới
                  </Text>
                </View>
                <View className="p-5 flex-1">
                  <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20 }}>
                    <View className="items-center mb-4">
                      <View className="relative">
                        <Image
                          source={{ uri: newStaffData.image || 'https://via.placeholder.com/100x100' }}
                          className="w-24 h-24 rounded-full"
                          resizeMode="cover"
                        />
                        {isLoading && (
                          <View className="absolute inset-0 bg-black/30 rounded-full justify-center items-center">
                            <ActivityIndicator size="small" color="#ffffff" />
                          </View>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={pickImage}
                        className="border border-gray-300 rounded-lg px-3 py-2 mt-2 flex-row items-center"
                        disabled={isLoading || permissionStatus !== 'granted'}
                      >
                        <Ionicons
                          name="cloud-upload-outline"
                          size={16}
                          color={isLoading || permissionStatus !== 'granted' ? '#9ca3af' : '#4b5563'}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={{
                            color: isLoading || permissionStatus !== 'granted' ? '#9ca3af' : '#4b5563',
                          }}
                        >
                          Chọn ảnh
                        </Text>
                      </TouchableOpacity>
                      {newStaffData.image && (
                        <TouchableOpacity
                          onPress={() => setNewStaffData({ ...newStaffData, image: null })}
                          className="flex-row items-center mt-2"
                        >
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                          <Text className="text-red-500 text-sm ml-1">Xóa ảnh</Text>
                        </TouchableOpacity>
                      )}
                      {permissionStatus === 'denied' && (
                        <Text className="text-red-500 text-xs mt-2">Cần cấp quyền truy cập thư viện ảnh</Text>
                      )}
                    </View>
                    <View className="mb-4">
                      <Text className="text-sm font-medium text-gray-700 mb-1">Tên Nhân viên</Text>
                      <TextInput
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Nhập tên nhân viên"
                        value={newStaffData.name}
                        onChangeText={(text) => setNewStaffData({ ...newStaffData, name: text })}
                      />
                    </View>
                    <View className="mb-4">
                      <Text className="text-sm font-medium text-gray-700 mb-1">Vai trò</Text>
                      <View className="flex-row flex-wrap">
                        {['waiter', 'chef', 'cashier', 'manager'].map((role) => (
                          <TouchableOpacity
                            key={role}
                            onPress={() => setNewStaffData({ ...newStaffData, role: role as Staff['role'] })}
                            className={`mr-2 mb-2 px-3 py-1 rounded-full ${
                              newStaffData.role === role
                                ? 'bg-[#00b14f] text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            <Text>
                              {role === 'waiter'
                                ? 'Phục vụ'
                                : role === 'chef'
                                ? 'Đầu bếp'
                                : role === 'cashier'
                                ? 'Thu ngân'
                                : 'Quản lý'}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    <View className="mb-4">
                      <Text className="text-sm font-medium text-gray-700 mb-1">Số điện thoại</Text>
                      <TextInput
                        className="border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Nhập số điện thoại (10 chữ số)"
                        value={newStaffData.phone}
                        onChangeText={(text) => setNewStaffData({ ...newStaffData, phone: text })}
                        keyboardType="phone-pad"
                        maxLength={10}
                      />
                    </View>
                    <View className="mb-4">
                      <Text className="text-sm font-medium text-gray-700 mb-1">Lịch làm việc</Text>
                      {[
                        { key: 'monday', label: 'Thứ Hai' },
                        { key: 'tuesday', label: 'Thứ Ba' },
                        { key: 'wednesday', label: 'Thứ Tư' },
                        { key: 'thursday', label: 'Thứ Năm' },
                        { key: 'friday', label: 'Thứ Sáu' },
                        { key: 'saturday', label: 'Thứ Bảy' },
                        { key: 'sunday', label: 'Chủ Nhật' },
                      ].map(({ key, label }) => (
                        <View key={key} className="mb-2">
                          <Text className="text-xs text-gray-600">{label}</Text>
                          <View className="flex-row flex-wrap">
                            {shiftOptions.map((shift) => (
                              <TouchableOpacity
                                key={`${key}-${shift}`}
                                onPress={() =>
                                  setNewStaffData({
                                    ...newStaffData,
                                    schedule: { ...newStaffData.schedule, [key]: shift },
                                  })
                                }
                                className={`mr-2 mb-2 px-3 py-1 rounded-full ${
                                  newStaffData.schedule[key as keyof Schedule] === shift
                                    ? 'bg-[#00b14f] text-white'
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                <Text>{shift}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>
                    <View className="flex-row gap-3">
                      <TouchableOpacity
                        onPress={handleAddStaff}
                        className={`flex-1 py-3 rounded-lg items-center ${
                          isLoading ? 'bg-gray-400' : 'bg-[#00b14f]'
                        }`}
                        disabled={isLoading}
                      >
                        <Text className="text-white font-medium">
                          {isLoading ? 'Đang thêm...' : 'Thêm Nhân Viên'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowAddStaffModal(false);
                          setIsLoading(false);
                        }}
                        className="flex-1 bg-gray-500 py-3 rounded-lg items-center"
                        disabled={isLoading}
                      >
                        <Text className="text-white font-medium">Hủy</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

export default AddStaffModal;
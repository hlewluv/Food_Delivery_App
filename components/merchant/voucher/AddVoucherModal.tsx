import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Define interfaces
interface Voucher {
  _id: string;
  name: string;
  discount: string;
  minOrder: string;
  expiryDate: string;
  image: string | null;
  status: 'pending' | 'approved' | 'rejected';
}

interface AddVoucherModalProps {
  showAddVoucherModal: boolean;
  setShowAddVoucherModal: (value: boolean) => void;
  setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  permissionStatus: 'granted' | 'denied' | null;
}

const AddVoucherModal: React.FC<AddVoucherModalProps> = ({
  showAddVoucherModal,
  setShowAddVoucherModal,
  setVouchers,
  isLoading,
  setIsLoading,
  permissionStatus,
}) => {
  const [newVoucherData, setNewVoucherData] = useState<Voucher>({
    _id: '',
    name: '',
    discount: '',
    minOrder: '',
    expiryDate: '',
    image: null,
    status: 'pending',
  });

  const pickImage = async () => {
    if (permissionStatus !== 'granted') {
      Alert.alert(
        'Quyền truy cập bị từ chối',
        'Vui lòng cấp quyền truy cập thư viện ảnh trong cài đặt thiết bị.',
        [{ text: 'OK' }],
      );
      return;
    }

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setNewVoucherData({ ...newVoucherData, image: result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi chọn ảnh.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    if (!newVoucherData.name.trim()) {
      Alert.alert('Lỗi', 'Tên voucher không được để trống.');
      return false;
    }
    const discountValue = parseFloat(newVoucherData.discount);
    if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
      Alert.alert('Lỗi', 'Giảm giá phải là số từ 1 đến 100.');
      return false;
    }
    const minOrderValue = parseFloat(newVoucherData.minOrder.replace(/,/g, ''));
    if (isNaN(minOrderValue) || minOrderValue < 0) {
      Alert.alert('Lỗi', 'Đơn tối thiểu phải là số không âm.');
      return false;
    }
    if (!newVoucherData.expiryDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      Alert.alert('Lỗi', 'Ngày hết hạn phải có định dạng DD/MM/YYYY.');
      return false;
    }
    return true;
  };

  const handleAddVoucher = () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      const newVoucher: Voucher = {
        _id: `voucher_${Date.now()}`,
        name: newVoucherData.name.trim(),
        discount: `${parseFloat(newVoucherData.discount)}%`,
        minOrder: `${parseFloat(newVoucherData.minOrder.replace(/,/g, '')).toLocaleString('vi-VN')}đ`,
        expiryDate: `HSD: ${newVoucherData.expiryDate}`,
        image: newVoucherData.image,
        status: 'pending',
      };

      // Simulate sending voucher creation request to admin
      console.log('Sending voucher creation request to admin:', newVoucher);

      setVouchers((prev) => [...prev, newVoucher]);
      Alert.alert('Thành công', 'Yêu cầu tạo voucher đã được gửi để admin phê duyệt.');
      setShowAddVoucherModal(false);
      setNewVoucherData({
        _id: '',
        name: '',
        discount: '',
        minOrder: '',
        expiryDate: '',
        image: null,
        status: 'pending',
      });
    } catch (error) {
      console.error('Error creating voucher:', error);
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu tạo voucher. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={showAddVoucherModal}
      animationType="slide"
      onRequestClose={() => setShowAddVoucherModal(false)}
    >
      <View className="flex-1 bg-black/50">
        <TouchableWithoutFeedback onPress={() => setShowAddVoucherModal(false)}>
          <View className="flex-1 justify-center items-center">
            <TouchableWithoutFeedback>
              <View
                className="bg-white rounded-lg overflow-hidden"
                style={{ width: 620, height: 620, maxWidth: '90%', maxHeight: '90%' }}
              >
                <View className="p-5 border-b border-gray-200">
                  <Text className="text-lg font-semibold text-gray-800">Thêm Voucher Mới</Text>
                </View>
                <View className="flex-row p-5" style={{ height: 548 }}>
                  <View className="w-1/3 pr-4 flex justify-start pt-10">
                    <View className="items-center" style={{ marginTop: 20 }}>
                      <View className="relative mb-2">
                        <Image
                          source={{
                            uri: newVoucherData.image || 'https://via.placeholder.com/200x160',
                          }}
                          style={{
                            width: 200,
                            height: 160,
                            borderRadius: 8,
                            backgroundColor: '#f3f4f6',
                            marginTop: 10,
                          }}
                          resizeMode="cover"
                        />
                        {isLoading && (
                          <View
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(0,0,0,0.3)',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 8,
                            }}
                          >
                            <ActivityIndicator size="small" color="#ffffff" />
                          </View>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={pickImage}
                        style={{
                          borderWidth: 1,
                          borderColor: '#d1d5db',
                          borderRadius: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 200,
                          backgroundColor: isLoading || permissionStatus !== 'granted' ? '#f3f4f6' : 'white',
                          marginTop: 8,
                        }}
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
                            fontSize: 14,
                            color: isLoading || permissionStatus !== 'granted' ? '#9ca3af' : '#374151',
                          }}
                        >
                          Chọn ảnh
                        </Text>
                      </TouchableOpacity>
                      {newVoucherData.image && (
                        <TouchableOpacity
                          onPress={() => setNewVoucherData({ ...newVoucherData, image: null })}
                          className="flex-row items-center mt-2"
                        >
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                          <Text className="text-red-500 text-sm ml-1">Xóa ảnh</Text>
                        </TouchableOpacity>
                      )}
                      {permissionStatus === 'denied' && (
                        <Text className="text-red-500 text-xs mt-2">
                          Cần cấp quyền truy cập thư viện ảnh
                        </Text>
                      )}
                    </View>
                  </View>
                  <ScrollView
                    className="w-2/3 pl-4"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20, paddingLeft: 20 }}
                  >
                    <View style={{ marginBottom: 16 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: 4,
                        }}
                      >
                        Tên Voucher
                      </Text>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: '#d1d5db',
                          borderRadius: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          fontSize: 14,
                        }}
                        placeholder="Nhập tên voucher"
                        value={newVoucherData.name}
                        onChangeText={(text: string) =>
                          setNewVoucherData({ ...newVoucherData, name: text })
                        }
                      />
                    </View>
                    <View style={{ marginBottom: 16 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: 4,
                        }}
                      >
                        Giảm Giá (%)
                      </Text>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: '#d1d5db',
                          borderRadius: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          fontSize: 14,
                        }}
                        placeholder="Nhập phần trăm giảm giá"
                        value={newVoucherData.discount}
                        onChangeText={(text: string) =>
                          setNewVoucherData({ ...newVoucherData, discount: text })
                        }
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={{ marginBottom: 16 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: 4,
                        }}
                      >
                        Đơn Tối Thiểu (đ)
                      </Text>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: '#d1d5db',
                          borderRadius: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          fontSize: 14,
                        }}
                        placeholder="Nhập giá trị đơn tối thiểu"
                        value={newVoucherData.minOrder}
                        onChangeText={(text: string) =>
                          setNewVoucherData({ ...newVoucherData, minOrder: text })
                        }
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={{ marginBottom: 16 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: 4,
                        }}
                      >
                        Ngày Hết Hạn
                      </Text>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderColor: '#d1d5db',
                          borderRadius: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          fontSize: 14,
                        }}
                        placeholder="VD: 30/06/2025"
                        value={newVoucherData.expiryDate}
                        onChangeText={(text: string) =>
                          setNewVoucherData({ ...newVoucherData, expiryDate: text })
                        }
                      />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <TouchableOpacity
                        onPress={handleAddVoucher}
                        style={{
                          flex: 1,
                          backgroundColor: '#16a34a',
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderRadius: 8,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        disabled={isLoading}
                      >
                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 14 }}>
                          Gửi Yêu Cầu
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setShowAddVoucherModal(false)}
                        style={{
                          flex: 1,
                          backgroundColor: '#6b7280',
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderRadius: 8,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        disabled={isLoading}
                      >
                        <Text style={{ color: 'white', fontWeight: '500', fontSize: 14 }}>Hủy</Text>
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

export { AddVoucherModal };
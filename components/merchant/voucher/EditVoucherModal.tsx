import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

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

interface EditVoucherModalProps {
  showEditVoucherModal: boolean;
  setShowEditVoucherModal: (value: boolean) => void;
  selectedVoucher: Voucher;
  setVouchers: React.Dispatch<React.SetStateAction<Voucher[]>>;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  permissionStatus: 'granted' | 'denied' | null;
}

const EditVoucherModal: React.FC<EditVoucherModalProps> = ({
  showEditVoucherModal,
  setShowEditVoucherModal,
  selectedVoucher,
  setVouchers,
  isLoading,
  setIsLoading,
  permissionStatus,
}) => {
  const [editVoucherData, setEditVoucherData] = useState<Voucher>({
    _id: '',
    name: '',
    discount: '',
    minOrder: '',
    expiryDate: '',
    image: null,
    status: 'pending',
  });
  const [editVoucherImageSize, setEditVoucherImageSize] = useState<number>(0);

  // Initialize form with selected voucher data
  useEffect(() => {
    if (selectedVoucher) {
      setEditVoucherData({
        _id: selectedVoucher._id,
        name: selectedVoucher.name,
        discount: selectedVoucher.discount.replace('%', ''),
        minOrder: selectedVoucher.minOrder.replace(/[,đ]/g, ''),
        expiryDate: selectedVoucher.expiryDate.replace('HSD: ', ''),
        image: selectedVoucher.image || null,
        status: selectedVoucher.status,
      });
      calculateImageSize(selectedVoucher.image);
    }
  }, [selectedVoucher]);

  const calculateImageSize = async (uri: string | null): Promise<void> => {
    if (!uri) {
      setEditVoucherImageSize(0);
      return;
    }
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      setEditVoucherImageSize(fileInfo.size / (1024 * 1024));
    } catch (error) {
      console.error('Error calculating image size:', error);
      setEditVoucherImageSize(0);
    }
  };

  const pickImage = async () => {
    if (permissionStatus !== 'granted') {
      Alert.alert(
        'Quyền truy cập bị từ chối',
        'Vui lòng cấp quyền truy cập thư viện ảnh trong cài đặt thiết bị.',
        [{ text: 'OK' }],
      );
      return;
    }

    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        const fileInfo = await FileSystem.getInfoAsync(selectedImage.uri);
        const sizeInMB = fileInfo.size / (1024 * 1024);

        if (sizeInMB > 2) {
          Alert.alert('Lỗi', 'Kích thước ảnh không được vượt quá 2MB');
          return;
        }

        setEditVoucherData({ ...editVoucherData, image: selectedImage.uri });
        setEditVoucherImageSize(sizeInMB);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi chọn ảnh. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    if (!editVoucherData.name.trim()) {
      Alert.alert('Lỗi', 'Tên voucher không được để trống.');
      return false;
    }
    const discountValue = parseFloat(editVoucherData.discount);
    if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
      Alert.alert('Lỗi', 'Giảm giá phải là số từ 1 đến 100.');
      return false;
    }
    const minOrderValue = parseFloat(editVoucherData.minOrder.replace(/,/g, ''));
    if (isNaN(minOrderValue) || minOrderValue < 0) {
      Alert.alert('Lỗi', 'Đơn tối thiểu phải là số không âm.');
      return false;
    }
    if (!editVoucherData.expiryDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      Alert.alert('Lỗi', 'Ngày hết hạn phải có định dạng DD/MM/YYYY.');
      return false;
    }
    return true;
  };

  const saveVoucherChanges = () => {
    if (!validateInputs()) {
      return;
    }

    if (selectedVoucher.status !== 'pending') {
      Alert.alert('Lỗi', 'Chỉ có thể chỉnh sửa voucher đang chờ phê duyệt!');
      return;
    }

    setIsLoading(true);
    try {
      const updatedVoucher: Voucher = {
        _id: selectedVoucher._id,
        name: editVoucherData.name.trim(),
        discount: `${parseFloat(editVoucherData.discount)}%`,
        minOrder: `${parseFloat(editVoucherData.minOrder.replace(/,/g, '')).toLocaleString('vi-VN')}đ`,
        expiryDate: `HSD: ${editVoucherData.expiryDate}`,
        image: editVoucherData.image,
        status: 'pending',
      };

      // Simulate sending voucher update request to admin
      console.log('Sending voucher update request to admin:', updatedVoucher);

      setVouchers((prev) =>
        prev.map((v) => (v._id === selectedVoucher._id ? updatedVoucher : v))
      );
      Alert.alert('Thành công', 'Yêu cầu cập nhật voucher đã được gửi để admin phê duyệt.');
      setShowEditVoucherModal(false);
    } catch (error) {
      console.error('Error updating voucher:', error);
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu cập nhật voucher. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVoucher = () => {
    if (selectedVoucher.status !== 'pending') {
      Alert.alert('Lỗi', 'Chỉ có thể xóa voucher đang chờ phê duyệt!');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate sending voucher deletion request to admin
      console.log('Sending voucher deletion request to admin:', selectedVoucher);

      setVouchers((prev) => prev.filter((v) => v._id !== selectedVoucher._id));
      Alert.alert('Thành công', 'Yêu cầu xóa voucher đã được gửi để admin phê duyệt.');
      setShowEditVoucherModal(false);
    } catch (error) {
      console.error('Error deleting voucher:', error);
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu xóa voucher. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={showEditVoucherModal}
      animationType="slide"
      onRequestClose={() => setShowEditVoucherModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowEditVoucherModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View
            className="bg-white rounded-lg overflow-hidden"
            style={{ width: 620, height: 620, maxWidth: '90%', maxHeight: '90%' }}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <View className="p-5 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-800">Chỉnh sửa Voucher</Text>
            </View>
            <View className="flex-row p-5" style={{ height: 548 }}>
              <View className="w-1/3 pr-4 flex justify-start pt-10">
                <View className="items-center" style={{ marginTop: 20 }}>
                  <View className="relative mb-2">
                    <Image
                      source={{
                        uri: editVoucherData.image || 'https://via.placeholder.com/200x160',
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
                      {editVoucherData.image ? 'Đổi ảnh' : 'Chọn ảnh'}
                    </Text>
                  </TouchableOpacity>
                  {editVoucherData.image && (
                    <View className="mt-2">
                      <Text className="text-gray-600 text-xs">
                        Kích thước: {editVoucherImageSize.toFixed(2)} MB
                      </Text>
                      <TouchableOpacity
                        inPress={() => {
                          setEditVoucherData({ ...editVoucherData, image: null });
                          setEditVoucherImageSize(0);
                        }}
                        className="flex-row items-center mt-1"
                      >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        <Text className="text-red-500 text-sm ml-1">Xóa ảnh</Text>
                      </TouchableOpacity>
                    </View>
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
                    value={editVoucherData.name}
                    onChangeText={(text: string) =>
                      setEditVoucherData({ ...editVoucherData, name: text })
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
                    value={editVoucherData.discount}
                    onChangeText={(text: string) =>
                      setEditVoucherData({ ...editVoucherData, discount: text })
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
                    value={editVoucherData.minOrder}
                    onChangeText={(text: string) =>
                      setEditVoucherData({ ...editVoucherData, minOrder: text })
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
                    value={editVoucherData.expiryDate}
                    onChangeText={(text: string) =>
                      setEditVoucherData({ ...editVoucherData, expiryDate: text })
                    }
                  />
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity
                    onPress={saveVoucherChanges}
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
                    onPress={handleDeleteVoucher}
                    style={{
                      flex: 1,
                      backgroundColor: '#dc2626',
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    disabled={isLoading}
                  >
                    <Text style={{ color: 'white', fontWeight: '500', fontSize: 14 }}>
                      Yêu Cầu Xóa
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditVoucherModal;
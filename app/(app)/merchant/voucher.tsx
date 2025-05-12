import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { router } from 'expo-router'

const VoucherScreen = () => {
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false)
  const [showEditVoucherModal, setShowEditVoucherModal] = useState(false)
  const [selectedVoucherIndex, setSelectedVoucherIndex] = useState(null)
  const [newVoucherData, setNewVoucherData] = useState({
    name: '',
    discount: '',
    minOrder: '',
    expiryDate: '',
    image: null
  })
  const [editVoucherData, setEditVoucherData] = useState({
    name: '',
    discount: '',
    minOrder: '',
    expiryDate: '',
    image: null
  })
  const [newVoucherImageSize, setNewVoucherImageSize] = useState(0)
  const [editVoucherImageSize, setEditVoucherImageSize] = useState(0)
  const [vouchers, setVouchers] = useState([
    {
      name: 'Giảm 15% ứng hộp đồn',
      discount: '15%',
      minOrder: '100,000đ',
      expiryDate: 'HSD: 30/06/2025',
      image: ''
    },
    {
      name: 'Phí lưu đơn 0đ từ đơn 100',
      discount: '40%',
      minOrder: '60,000đ',
      expiryDate: 'HSD: 15/05/2025'
    },
    {
      name: 'Phí lưu đơn 0đ từ đơn 100',
      discount: '40%',
      minOrder: '60,000đ',
      expiryDate: 'HSD: 15/05/2025'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        setPermissionDenied(true)
      }
    })()
  }, [])

  const pickImage = async (setData, data, setImageSize) => {
    if (permissionDenied) {
      Alert.alert(
        'Quyền truy cập bị từ chối',
        'Vui lòng cấp quyền truy cập thư viện ảnh trong cài đặt thiết bị'
      )
      return
    }

    try {
      setIsLoading(true)
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0]
        const fileInfo = await FileSystem.getInfoAsync(selectedImage.uri)
        const sizeInMB = fileInfo.size / (1024 * 1024)

        if (sizeInMB > 2) {
          Alert.alert('Lỗi', 'Kích thước ảnh không được vượt quá 2MB')
          return
        }

        setData({ ...data, image: selectedImage.uri })
        setImageSize(sizeInMB)
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi chọn ảnh')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateImageSize = async uri => {
    if (!uri) return 0
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri)
      return fileInfo.size / (1024 * 1024)
    } catch (error) {
      console.error('Error calculating image size:', error)
      return 0
    }
  }

  const handleAddVoucher = () => {
    if (
      !newVoucherData.name ||
      !newVoucherData.discount ||
      !newVoucherData.minOrder ||
      !newVoucherData.expiryDate
    ) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!')
      return
    }

    const newVoucher = {
      name: newVoucherData.name,
      discount: `${newVoucherData.discount}%`,
      minOrder: `${newVoucherData.minOrder}đ`,
      expiryDate: `HSD: ${newVoucherData.expiryDate}`,
      image: newVoucherData.image
    }

    setVouchers([...vouchers, newVoucher])
    setShowAddVoucherModal(false)
    setNewVoucherData({
      name: '',
      discount: '',
      minOrder: '',
      expiryDate: '',
      image: null
    })
    setNewVoucherImageSize(0)
  }

  const handleEditVoucher = () => {
    if (
      !editVoucherData.name ||
      !editVoucherData.discount ||
      !editVoucherData.minOrder ||
      !editVoucherData.expiryDate
    ) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!')
      return
    }

    const updatedVouchers = [...vouchers]
    updatedVouchers[selectedVoucherIndex] = {
      name: editVoucherData.name,
      discount: `${editVoucherData.discount}%`,
      minOrder: `${editVoucherData.minOrder}đ`,
      expiryDate: `HSD: ${editVoucherData.expiryDate}`,
      image: editVoucherData.image
    }

    setVouchers(updatedVouchers)
    setShowEditVoucherModal(false)
    setSelectedVoucherIndex(null)
    setEditVoucherImageSize(0)
  }

  const handleDeleteVoucher = () => {
    const updatedVouchers = vouchers.filter((_, index) => index !== selectedVoucherIndex)
    setVouchers(updatedVouchers)
    setShowEditVoucherModal(false)
    setSelectedVoucherIndex(null)
    setEditVoucherImageSize(0)
  }

  const openEditModal = async index => {
    const voucher = vouchers[index]
    setSelectedVoucherIndex(index)
    const imageSize = await calculateImageSize(voucher.image)
    setEditVoucherData({
      name: voucher.name,
      discount: voucher.discount.replace('%', ''),
      minOrder: voucher.minOrder.replace('đ', ''),
      expiryDate: voucher.expiryDate.replace('HSD: ', ''),
      image: voucher.image || null
    })
    setEditVoucherImageSize(imageSize)
    setShowEditVoucherModal(true)
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center p-4 bg-white shadow-md">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2"
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold text-gray-900">
          Quản lý Voucher
        </Text>
      </View>

      {/* Voucher List */}
      <ScrollView className="flex-1 px-4 py-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-semibold text-gray-900">
            Voucher Nhà Hàng
          </Text>
          <TouchableOpacity
            onPress={() => setShowAddVoucherModal(true)}
            className="bg-[#00b14f] px-4 py-2 rounded-full shadow-md"
            accessibilityLabel="Thêm voucher mới"
          >
            <Text className="text-white font-semibold">+ Thêm</Text>
          </TouchableOpacity>
        </View>

        {vouchers.map((voucher, index) => (
          <View
            key={index}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm flex-row items-center"
          >
            {voucher.image ? (
              <Image
                source={{ uri: voucher.image }}
                className="w-16 h-16 rounded-lg mr-4"
                resizeMode="cover"
              />
            ) : (
              <View className="bg-[#00b14f] rounded-lg w-16 h-16 flex items-center justify-center mr-4">
                <Text className="text-white font-bold text-lg">{voucher.discount}</Text>
              </View>
            )}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">{voucher.name}</Text>
              <Text className="text-gray-600 text-sm">
                Đơn tối thiểu: {voucher.minOrder}
              </Text>
              <Text className="text-gray-600 text-sm">{voucher.expiryDate}</Text>
            </View>
            <TouchableOpacity
              onPress={() => openEditModal(index)}
              className="bg-[#00b14f] px-4 py-2 rounded-full"
              accessibilityLabel={`Chỉnh sửa voucher ${voucher.name}`}
            >
              <Text className="text-white font-semibold">Sửa</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Add Voucher Modal */}
      <Modal
        transparent={true}
        visible={showAddVoucherModal}
        animationType="fade"
        onRequestClose={() => setShowAddVoucherModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowAddVoucherModal(false)}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <TouchableWithoutFeedback>
              <View className="bg-white p-6 rounded-2xl w-11/12 max-h-[85%]">
                <ScrollView>
                  <Text className="text-2xl font-bold text-gray-900 mb-6">
                    Thêm Voucher Mới
                  </Text>

                  {/* Image Upload Section */}
                  <View className="bg-gray-50 rounded-xl p-4 mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">
                      Ảnh Voucher
                    </Text>
                    <View className="flex-row items-center">
                      <View className="w-1/3">
                        {newVoucherData.image ? (
                          <Image
                            source={{ uri: newVoucherData.image }}
                            className="w-20 h-20 rounded-lg"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Ionicons name="image-outline" size={24} color="#6B7280" />
                          </View>
                        )}
                      </View>
                      <View className="w-2/3 pl-4">
                        <Text className="text-gray-600 text-sm mb-2">
                          Tối đa 2MB, định dạng PNG, JPEG
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            pickImage(setNewVoucherData, newVoucherData, setNewVoucherImageSize)
                          }
                          className="bg-[#00b14f] px-4 py-2 rounded-full flex-row items-center justify-center"
                          disabled={isLoading || permissionDenied}
                          accessibilityLabel="Tải ảnh voucher"
                        >
                          {isLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <>
                              <Ionicons
                                name="cloud-upload-outline"
                                size={20}
                                color="#FFFFFF"
                                className="mr-2"
                              />
                              <Text className="text-white font-semibold">Tải ảnh</Text>
                            </>
                          )}
                        </TouchableOpacity>
                        {newVoucherData.image && (
                          <View className="mt-2">
                            <Text className="text-gray-600 text-xs">
                              Kích thước: {newVoucherImageSize.toFixed(2)} MB
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                setNewVoucherData({ ...newVoucherData, image: null })
                                setNewVoucherImageSize(0)
                              }}
                              className="flex-row items-center mt-1"
                              accessibilityLabel="Xóa ảnh voucher"
                            >
                              <Ionicons name="trash-outline" size={16} color="#EF4444" />
                              <Text className="text-red-500 text-sm ml-1">Xóa ảnh</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                        {permissionDenied && (
                          <Text className="text-red-500 text-xs mt-2">
                            Cần cấp quyền truy cập thư viện ảnh
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Input Fields */}
                  <Text className="text-gray-900 font-medium mb-2">Tên Voucher</Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg mb-4 bg-white"
                    placeholder="Nhập tên voucher"
                    value={newVoucherData.name}
                    onChangeText={text => setNewVoucherData({ ...newVoucherData, name: text })}
                    accessibilityLabel="Tên voucher"
                  />

                  <Text className="text-gray-900 font-medium mb-2">Giảm Giá (%)</Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg mb-4 bg-white"
                    placeholder="Nhập phần trăm giảm giá"
                    value={newVoucherData.discount}
                    onChangeText={text => setNewVoucherData({ ...newVoucherData, discount: text })}
                    keyboardType="numeric"
                    accessibilityLabel="Phần trăm giảm giá"
                  />

                  <Text className="text-gray-900 font-medium mb-2">Đơn Tối Thiểu (đ)</Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg mb-4 bg-white"
                    placeholder="Nhập giá trị đơn tối thiểu"
                    value={newVoucherData.minOrder}
                    onChangeText={text => setNewVoucherData({ ...newVoucherData, minOrder: text })}
                    keyboardType="numeric"
                    accessibilityLabel="Giá trị đơn tối thiểu"
                  />

                  <Text className="text-gray-900 font-medium mb-2">Ngày Hết Hạn</Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg mb-6 bg-white"
                    placeholder="VD: 30/06/2025"
                    value={newVoucherData.expiryDate}
                    onChangeText={text =>
                      setNewVoucherData({ ...newVoucherData, expiryDate: text })
                    }
                    accessibilityLabel="Ngày hết hạn"
                  />

                  {/* Buttons */}
                  <View className="flex-row justify-between">
                    <TouchableOpacity
                      onPress={handleAddVoucher}
                      className="bg-[#00b14f] px-6 py-3 rounded-full flex-1 mr-2"
                      accessibilityLabel="Thêm voucher"
                    >
                      <Text className="text-white font-semibold text-center">Thêm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setShowAddVoucherModal(false)}
                      className="bg-gray-500 px-6 py-3 rounded-full flex-1 ml-2"
                      accessibilityLabel="Hủy thêm voucher"
                    >
                      <Text className="text-white font-semibold text-center">Hủy</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Edit Voucher Modal */}
      <Modal
        transparent={true}
        visible={showEditVoucherModal}
        animationType="fade"
        onRequestClose={() => setShowEditVoucherModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowEditVoucherModal(false)}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <TouchableWithoutFeedback>
              <View className="bg-white p-6 rounded-2xl w-11/12 max-h-[85%]">
                <ScrollView>
                  <Text className="text-2xl font-bold text-gray-900 mb-6">
                    Chỉnh Sửa Voucher
                  </Text>

                  {/* Image Upload Section */}
                  <View className="bg-gray-50 rounded-xl p-4 mb-6">
                    <Text className="text-lg font-semibold text-gray-900 mb-3">
                      Ảnh Voucher
                    </Text>
                    <View className="flex-row items-center">
                      <View className="w-1/3">
                        {editVoucherData.image ? (
                          <Image
                            source={{ uri: editVoucherData.image }}
                            className="w-20 h-20 rounded-lg"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Ionicons name="image-outline" size={24} color="#6B7280" />
                          </View>
                        )}
                      </View>
                      <View className="w-2/3 pl-4">
                        <Text className="text-gray-600 text-sm mb-2">
                          Tối đa 2MB, định dạng PNG, JPEG
                        </Text>
                        <TouchableOpacity
                          onPress={() =>
                            pickImage(setEditVoucherData, editVoucherData, setEditVoucherImageSize)
                          }
                          className="bg-[#00b14f] px-4 py-2 rounded-full flex-row items-center justify-center"
                          disabled={isLoading || permissionDenied}
                          accessibilityLabel={editVoucherData.image ? "Thay ảnh voucher" : "Tải ảnh voucher"}
                        >
                          {isLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                          ) : (
                            <>
                              <Ionicons
                                name="cloud-upload-outline"
                                size={20}
                                color="#FFFFFF"
                                className="mr-2"
                              />
                              <Text className="text-white font-semibold">
                                {editVoucherData.image ? 'Thay ảnh' : 'Tải ảnh'}
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                        {editVoucherData.image && (
                          <View className="mt-2">
                            <Text className="text-gray-600 text-xs">
                              Kích thước: {editVoucherImageSize.toFixed(2)} MB
                            </Text>
                            <TouchableOpacity
                              onPress={() => {
                                setEditVoucherData({ ...editVoucherData, image: null })
                                setEditVoucherImageSize(0)
                              }}
                              className="flex-row items-center mt-1"
                              accessibilityLabel="Xóa ảnh voucher"
                            >
                              <Ionicons name="trash-outline" size={16} color="#EF4444" />
                              <Text className="text-red-500 text-sm ml-1">Xóa ảnh</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                        {permissionDenied && (
                          <Text className="text-red-500 text-xs mt-2">
                            Cần cấp quyền truy cập thư viện ảnh
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Input Fields */}
                  <Text className="text-gray-900 font-medium mb-2">Tên Voucher</Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg mb-4 bg-white"
                    placeholder="Nhập tên voucher"
                    value={editVoucherData.name}
                    onChangeText={text => setEditVoucherData({ ...editVoucherData, name: text })}
                    accessibilityLabel="Tên voucher"
                  />

                  <Text className="text-gray-900 font-medium mb-2">Giảm Giá (%)</Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg mb-4 bg-white"
                    placeholder="Nhập phần trăm giảm giá"
                    value={editVoucherData.discount}
                    onChangeText={text =>
                      setEditVoucherData({ ...editVoucherData, discount: text })
                    }
                    keyboardType="numeric"
                    accessibilityLabel="Phần trăm giảm giá"
                  />

                  <Text className="text-gray-900 font-medium mb-2">Đơn Tối Thiểu (đ)</Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg mb-4 bg-white"
                    placeholder="Nhập giá trị đơn tối thiểu"
                    value={editVoucherData.minOrder}
                    onChangeText={text =>
                      setEditVoucherData({ ...editVoucherData, minOrder: text })
                    }
                    keyboardType="numeric"
                    accessibilityLabel="Giá trị đơn tối thiểu"
                  />

                  <Text className="text-gray-900 font-medium mb-2">Ngày Hết Hạn</Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg mb-6 bg-white"
                    placeholder="VD: 30/06/2025"
                    value={editVoucherData.expiryDate}
                    onChangeText={text =>
                      setEditVoucherData({ ...editVoucherData, expiryDate: text })
                    }
                    accessibilityLabel="Ngày hết hạn"
                  />

                  {/* Buttons */}
                  <View className="flex-row justify-between">
                    <TouchableOpacity
                      onPress={handleEditVoucher}
                      className="bg-[#00b14f] px-6 py-3 rounded-full flex-1 mr-2"
                      accessibilityLabel="Lưu voucher"
                    >
                      <Text className="text-white font-semibold text-center">Lưu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleDeleteVoucher}
                      className="bg-red-500 px-6 py-3 rounded-full flex-1 mx-2"
                      accessibilityLabel="Xóa voucher"
                    >
                      <Text className="text-white font-semibold text-center">Xóa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setShowEditVoucherModal(false)}
                      className="bg-gray-500 px-6 py-3 rounded-full flex-1 ml-2"
                      accessibilityLabel="Hủy chỉnh sửa voucher"
                    >
                      <Text className="text-white font-semibold text-center">Hủy</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

export default VoucherScreen
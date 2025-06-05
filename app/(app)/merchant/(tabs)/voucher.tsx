import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { AddVoucherModal } from '@/components/merchant/voucher/AddVoucherModal'
import EditVoucherModal from '@/components/merchant/voucher/EditVoucherModal'
import * as ImagePicker from 'expo-image-picker'

// Define interfaces
interface Voucher {
  _id: string
  name: string
  discount: string
  minOrder: string
  expiryDate: string
  image: string | null
  status: 'pending' | 'approved' | 'rejected'
}

// Hardcoded voucher data
const initialVouchers: Voucher[] = [
  {
    _id: '1',
    name: 'Giảm giá 20% cho đơn đầu tiên',
    discount: '20%',
    minOrder: '100,000đ',
    expiryDate: 'HSD: 30/06/2025',
    image: null,
    status: 'approved'
  },
  {
    _id: '2',
    name: 'Ưu đãi cuối tuần',
    discount: '15%',
    minOrder: '200,000đ',
    expiryDate: 'HSD: 15/07/2025',
    image: 'https://via.placeholder.com/200x160',
    status: 'pending'
  }
]

const VoucherScreen: React.FC = () => {
  const [showAddVoucherModal, setShowAddVoucherModal] = useState<boolean>(false)
  const [showEditVoucherModal, setShowEditVoucherModal] = useState<boolean>(false)
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | null>(null)

  // Check permissions for image picker
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
        setPermissionStatus(
          libraryStatus === 'granted' && cameraStatus === 'granted' ? 'granted' : 'denied'
        )
      } catch (error) {
        console.error('Error checking permissions:', error)
        setPermissionStatus('denied')
      }
    }
    checkPermissions()
  }, [])

  const openEditModal = (voucher: Voucher) => {
    setSelectedVoucher(voucher)
    setShowEditVoucherModal(true)
  }

  const pendingVouchers = vouchers.filter(voucher => voucher.status === 'pending')
  const approvedVouchers = vouchers.filter(voucher => voucher.status === 'approved')

  return (
    <View className='flex-1 bg-gray-50'>
      {/* Header */}
            <View className='flex-row items-center p-4 bg-white border-b border-gray-200 py-[43.5]'>
              <Text className='flex-1 text-center text-4xl font-bold text-gray-900'>
                Quản lý voucher
              </Text>
            </View>

      {/* Voucher List */}
      <ScrollView className='flex-1 px-4 py-6 bg-white'>
        <View className='flex-row justify-between items-center mb-6'>
          <Text className='text-2xl font-semibold text-gray-900'>Voucher Nhà Hàng</Text>
          <TouchableOpacity
            onPress={() => setShowAddVoucherModal(true)}
            className='bg-[#00b14f] px-4 py-2 rounded-full shadow-md'
            accessibilityLabel='Thêm voucher mới'>
            <Text className='text-white font-semibold'>+ Thêm</Text>
          </TouchableOpacity>
        </View>

        {/* Pending Vouchers Section */}
        {pendingVouchers.length > 0 && (
          <View className='mb-6'>
            <Text className='text-xl font-semibold text-gray-900 mb-4'>
              Voucher Đang Chờ Phê Duyệt
            </Text>
            {pendingVouchers.map(voucher => (
              <View
                key={voucher._id}
                className='bg-yellow-50 rounded-xl p-4 mb-4 shadow-sm flex-row items-center'>
                {voucher.image ? (
                  <Image
                    source={{ uri: voucher.image }}
                    className='w-16 h-16 rounded-lg mr-4'
                    resizeMode='cover'
                  />
                ) : (
                  <View className='bg-yellow-200 rounded-lg w-16 h-16 flex items-center justify-center mr-4'>
                    <Text className='text-gray-800 font-bold text-lg'>{voucher.discount}</Text>
                  </View>
                )}
                <View className='flex-1'>
                  <Text className='text-lg font-semibold text-gray-900'>{voucher.name}</Text>
                  <Text className='text-gray-600 text-sm'>Đơn tối thiểu: {voucher.minOrder}</Text>
                  <Text className='text-gray-600 text-sm'>{voucher.expiryDate}</Text>
                  <Text className='text-yellow-600 text-sm font-medium mt-1'>
                    Đang chờ admin phê duyệt...
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => openEditModal(voucher)}
                  className='bg-[#00b14f] px-4 py-2 rounded-full'
                  accessibilityLabel={`Chỉnh sửa voucher ${voucher.name}`}>
                  <Text className='text-white font-semibold'>Sửa</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Approved Vouchers Section */}
        {approvedVouchers.length > 0 && (
          <View>
            <Text className='text-xl font-semibold text-gray-900 mb-4'>Voucher Đã Phê Duyệt</Text>
            {approvedVouchers.map(voucher => (
              <View
                key={voucher._id}
                className='bg-white rounded-xl p-4 mb-4 shadow-sm flex-row items-center'>
                {voucher.image ? (
                  <Image
                    source={{ uri: voucher.image }}
                    className='w-16 h-16 rounded-lg mr-4'
                    resizeMode='cover'
                  />
                ) : (
                  <View className='bg-[#00b14f] rounded-lg w-16 h-16 flex items-center justify-center mr-4'>
                    <Text className='text-white font-bold text-lg'>{voucher.discount}</Text>
                  </View>
                )}
                <View className='flex-1'>
                  <Text className='text-lg font-semibold text-gray-900'>{voucher.name}</Text>
                  <Text className='text-gray-600 text-sm'>Đơn tối thiểu: {voucher.minOrder}</Text>
                  <Text className='text-gray-600 text-sm'>{voucher.expiryDate}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {isLoading && (
          <View className='flex-1 justify-center items-center'>
            <ActivityIndicator size='large' color='#00b14f' />
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <AddVoucherModal
        showAddVoucherModal={showAddVoucherModal}
        setShowAddVoucherModal={setShowAddVoucherModal}
        setVouchers={setVouchers}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        permissionStatus={permissionStatus}
      />
      {selectedVoucher && (
        <EditVoucherModal
          showEditVoucherModal={showEditVoucherModal}
          setShowEditVoucherModal={setShowEditVoucherModal}
          selectedVoucher={selectedVoucher}
          setVouchers={setVouchers}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          permissionStatus={permissionStatus}
        />
      )}
    </View>
  )
}

export default VoucherScreen

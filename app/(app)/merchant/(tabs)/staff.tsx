import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { Schedule, Staff, initialStaff } from '@/components/merchant/staff/types'
import AddStaffModal from '@/components/merchant/staff/AddStaffModal'
import EditStaffModal from '@/components/merchant/staff/EditStaffModal'
import StaffList from '@/components/merchant/staff/StaffList'

const StaffScreen: React.FC = () => {
  const [showAddStaffModal, setShowAddStaffModal] = useState<boolean>(false)
  const [showEditStaffModal, setShowEditStaffModal] = useState<boolean>(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | null>(null)
  const [filterDay, setFilterDay] = useState<keyof Schedule | 'all'>('all')
  const [tableRenderKey, setTableRenderKey] = useState(0)

  useEffect(() => {
    console.log('isLoading changed:', isLoading)
  }, [isLoading])

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.log('isLoading reset by timeout')
        setIsLoading(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [isLoading])

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

  useEffect(() => {
    console.log('staffList updated:', staffList)
  }, [staffList])

  return (
    <View className='flex-1 bg-white  '>
      {/* Header */}
      <View className='flex-row items-center p-4 bg-white border-b border-gray-200 py-[43.5]'>
        <Text className='flex-1 text-center text-4xl font-bold text-gray-900'>
          Quản lý nhân viên
        </Text>
      </View>

      {/* Main Content */}
      <View className='px-2 py-4 '>
        {/* Filter and Add Staff Button */}
        <View className='flex-row justify-between items-center mb-4'>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className='flex-row'>
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'monday', label: 'Thứ Hai' },
                { key: 'tuesday', label: 'Thứ Ba' },
                { key: 'wednesday', label: 'Thứ Tư' },
                { key: 'thursday', label: 'Thứ Năm' },
                { key: 'friday', label: 'Thứ Sáu' },
                { key: 'saturday', label: 'Thứ Bảy' },
                { key: 'sunday', label: 'Chủ Nhật' }
              ].map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => setFilterDay(key as keyof Schedule | 'all')}
                  className={`px-3 py-1 rounded-full mr-2 ${
                    filterDay === key ? 'bg-[#00b14f] text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                  <Text className='text-sm'>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => setShowAddStaffModal(true)}
            className='bg-[#00b14f] px-4 py-2 rounded-full'
            accessibilityLabel='Thêm nhân viên mới'>
            <Text className='text-white font-semibold'>+ Thêm Nhân viên</Text>
          </TouchableOpacity>
        </View>

        {/* Staff Table */}
        <StaffList
          staffList={staffList}
          filterDay={filterDay}
          isLoading={isLoading}
          setStaffList={setStaffList}
          setSelectedStaff={setSelectedStaff}
          setShowEditStaffModal={setShowEditStaffModal}
          setIsLoading={setIsLoading}
          setTableRenderKey={setTableRenderKey}
        />

        {isLoading && (
          <View className='absolute inset-0 bg-black/30 justify-center items-center'>
            <ActivityIndicator size='large' color='#00b14f' />
          </View>
        )}
      </View>

      {/* Add Staff Modal */}
      <AddStaffModal
        visible={showAddStaffModal}
        setShowAddStaffModal={setShowAddStaffModal}
        setStaffList={setStaffList}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        permissionStatus={permissionStatus}
        setFilterDay={setFilterDay}
      />

      {/* Edit Staff Modal */}
      {selectedStaff && (
        <EditStaffModal
          visible={showEditStaffModal}
          setShowEditStaffModal={setShowEditStaffModal}
          selectedStaff={selectedStaff}
          setStaffList={setStaffList}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          permissionStatus={permissionStatus}
        />
      )}
    </View>
  )
}

export default StaffScreen

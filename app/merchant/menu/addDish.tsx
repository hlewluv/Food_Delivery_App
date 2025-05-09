import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

const AddDishScreen = () => {
  // Hardcoded form state
  const [formData, setFormData] = useState({
    dishName: '',
    description: '',
    price: '',
    category: 'Đặc sản', // Default category
    notes: '',
    image: null
  })
  const [imageSize, setImageSize] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  // Hardcoded category options (can be fetched from API later)
  const categories = [
    { label: 'Đặc sản', value: 'Đặc sản' },
    { label: 'Món chính', value: 'Món chính' },
    { label: 'Đồ uống', value: 'Đồ uống' }
  ]

  // Check and request permissions on component mount
  useEffect(() => {
    ;(async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        setPermissionDenied(true)
      }
    })()
  }, [])

  // Function to handle image selection
  const pickImage = async () => {
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

        // Check file size
        const fileInfo = await FileSystem.getInfoAsync(selectedImage.uri)
        const sizeInMB = fileInfo.size / (1024 * 1024)

        if (sizeInMB > 2) {
          Alert.alert('Lỗi', 'Kích thước ảnh không được vượt quá 2MB')
          return
        }

        setFormData({ ...formData, image: selectedImage.uri })
        setImageSize(sizeInMB)
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi chọn ảnh')
    } finally {
      setIsLoading(false)
    }
  }

  // Function to handle form submission
  const handleSubmit = () => {
    // Validation
    if (!formData.dishName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên món ăn')
      return
    }

    if (!formData.price.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập giá món ăn')
      return
    }

    // Structured data for API (ready to send)
    const newDish = {
      name: formData.dishName,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      notes: formData.notes,
      image: formData.image
    }

    console.log('Data to send to API:', newDish)

    Alert.alert('Thành công', 'Món ăn đã được thêm thành công', [
      { text: 'OK', onPress: () => resetForm() }
    ])
  }

  // Reset form after submission
  const resetForm = () => {
    setFormData({
      dishName: '',
      description: '',
      price: '',
      category: 'Đặc sản',
      notes: '',
      image: null
    })
    setImageSize(0)
  }

  return (
    <ScrollView className='flex-1 bg-white' contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Image Upload Section */}
      {/* Image Upload Section */}
      <View className='p-4 mx-4 my-2 bg-white rounded-lg border border-gray-200'>
        <View className='flex-row'>
          {/* Left Column: Image (Centered) */}
          <View className='w-1/3 flex items-center justify-center'>
            {formData.image ? (
              <Image
                source={{ uri: formData.image }}
                className='w-24 h-24 rounded-lg'
                resizeMode='cover'
              />
            ) : (
              <View className='w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center'>
                <Ionicons name='image-outline' size={20} color='gray' />
              </View>
            )}
          </View>

          {/* Right Column: Text and Controls */}
          <View className='w-2/3 pl-3'>
            <Text className='text-base font-semibold text-gray-800 mb-2'>Thêm món mới</Text>

            {permissionDenied && (
              <Text className='text-red-500 text-xs mb-2'>Cần cấp quyền truy cập thư viện ảnh</Text>
            )}

            <Text className='text-gray-600 text-sm mb-2'>
              Ảnh chất lượng cao, tối đa 2MB, định dạng PNG, JPEG
            </Text>

            <TouchableOpacity
              onPress={pickImage}
              className='border border-gray-300 rounded-lg px-3 py-1.5 flex-row items-center justify-center'
              disabled={isLoading || permissionDenied}>
              {isLoading ? (
                <ActivityIndicator size='small' color='#000000' />
              ) : (
                <>
                  <Ionicons name='cloud-upload-outline' size={18} color='gray' className='mr-1' />
                  <Text className='text-gray-800 text-sm'>Thêm ảnh</Text>
                </>
              )}
            </TouchableOpacity>

            {formData.image && (
              <Text className='text-gray-500 text-xs mt-1'>
                Kích thước: {imageSize.toFixed(2)} MB
              </Text>
            )}

            {formData.image && (
              <TouchableOpacity
                onPress={() => {
                  setFormData({ ...formData, image: null })
                  setImageSize(0)
                }}
                className='mt-1 flex-row items-center'>
                <Ionicons name='trash-outline' size={14} color='red' />
                <Text className='text-red-500 text-xs ml-1'>Xóa ảnh</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Form Fields */}
      <View className='p-5 mx-4 my-2 bg-white rounded-lg border border-gray-200'>
        {/* Tên món ăn */}
        <TextInput
          className='border border-gray-300 rounded-lg p-3 mb-4 text-base'
          style={{ height: 52 }} // Set height to 52
          placeholder='Tên món ăn'
          value={formData.dishName}
          onChangeText={text => setFormData({ ...formData, dishName: text })}
        />
        {/* Mô tả */}
        <TextInput
          className='border border-gray-300 rounded-lg p-3 mb-4 text-base'
          style={{ height: 52 }} // Set height to 52
          placeholder='Mô tả'
          value={formData.description}
          onChangeText={text => setFormData({ ...formData, description: text })}
          multiline
        />
        {/* Giá */}
        <TextInput
          className='border border-gray-300 rounded-lg p-3 mb-4 text-base'
          style={{ height: 52 }} // Set height to 52
          placeholder='Giá'
          value={formData.price}
          onChangeText={text => setFormData({ ...formData, price: text })}
          keyboardType='numeric'
        />
        {/* Danh mục */}
        <View className='border border-gray-300 rounded-lg mb-4'>
          <Picker
            selectedValue={formData.category}
            onValueChange={itemValue => setFormData({ ...formData, category: itemValue })}
            style={{
              height: 52, // Set height to 52
              paddingHorizontal: 12,
              fontSize: 14 // Reduce font size for selected item
            }}
            itemStyle={{ fontSize: 14 }} // Reduce font size for dropdown items
            dropdownIconColor='#6b7280' // Color of dropdown icon (gray-500)
          >
            {categories.map((cat, index) => (
              <Picker.Item key={index} label={cat.label} value={cat.value} />
            ))}
          </Picker>
        </View>
        {/* Ghi chú */}
        <TextInput
          className='border border-gray-300 rounded-lg p-3 mb-4 text-base'
          style={{ height: 52 }} // Set height to 52
          placeholder='Ghi chú'
          value={formData.notes}
          onChangeText={text => setFormData({ ...formData, notes: text })}
          multiline
        />
      </View>

      {/* Submit Button */}
      <View className='px-4 pt-[88px]'>
        <TouchableOpacity
          onPress={handleSubmit}
          className='bg-green-600 p-4 rounded-lg items-center justify-center'
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color='white' />
          ) : (
            <Text className='text-white text-lg font-medium'>Thêm món ăn</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default AddDishScreen

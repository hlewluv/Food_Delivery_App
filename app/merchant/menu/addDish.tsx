import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const AddDishScreen = () => {
  // State for form fields
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Đặc sản');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSize, setImageSize] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Check and request permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
      }
    })();
  }, []);

  // Function to handle image selection
  const pickImage = async () => {
    if (permissionDenied) {
      Alert.alert(
        'Quyền truy cập bị từ chối',
        'Vui lòng cấp quyền truy cập thư viện ảnh trong cài đặt thiết bị'
      );
      return;
    }

    try {
      setIsLoading(true);
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        // Check file size
        const fileInfo = await FileSystem.getInfoAsync(selectedImage.uri);
        const sizeInMB = fileInfo.size / (1024 * 1024);
        
        if (sizeInMB > 2) {
          Alert.alert('Lỗi', 'Kích thước ảnh không được vượt quá 2MB');
          return;
        }

        setImage(selectedImage.uri);
        setImageSize(sizeInMB);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi chọn ảnh');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle form submission
  const handleSubmit = () => {
    if (!dishName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên món ăn');
      return;
    }

    if (!price.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập giá món ăn');
      return;
    }

    const newDish = {
      name: dishName,
      description,
      price,
      category,
      image,
    };

    console.log('New dish:', newDish);
    Alert.alert('Thành công', 'Món ăn đã được thêm thành công', [
      { text: 'OK', onPress: () => resetForm() }
    ]);
  };

  // Reset form after submission
  const resetForm = () => {
    setDishName('');
    setDescription('');
    setPrice('');
    setCategory('Đặc sản');
    setImage(null);
    setImageSize(0);
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Image Upload Section */}
      <View className="p-5 mx-4 my-2 bg-white rounded-lg border border-gray-200">
        <Text className="text-lg font-semibold text-gray-800 mb-3">Thêm món mới</Text>
        
        {permissionDenied && (
          <Text className="text-red-500 text-sm mb-3">
            Bạn cần cấp quyền truy cập thư viện ảnh để thêm hình ảnh
          </Text>
        )}
        
        <Text className="text-gray-600 text-base mb-3">
          Món ăn với hình ảnh chất lượng cao thường rất được ưa chuộng. Tệp ảnh nặng tối đa 2 MB và chỉ chấp nhận định dạng: PNG, JPEG
        </Text>
        
        <View className="border-b border-gray-200 my-3" />
        
        <View className="flex-row items-center">
          {image ? (
            <Image 
              source={{ uri: image }} 
              className="w-20 h-20 rounded-lg mr-3" 
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <Ionicons name="image-outline" size={24} color="gray" />
            </View>
          )}
          
          <View className="flex-1">
            <TouchableOpacity 
              onPress={pickImage}
              className="border border-gray-300 rounded-lg px-4 py-2 flex-row items-center justify-center"
              disabled={isLoading || permissionDenied}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={20} color="gray" className="mr-2" />
                  <Text className="text-gray-800">Thêm hình ảnh</Text>
                </>
              )}
            </TouchableOpacity>
            
            {image && (
              <Text className="text-gray-500 text-xs mt-1">
                Kích thước: {imageSize.toFixed(2)} MB
              </Text>
            )}
          </View>
        </View>
        
        {image && (
          <TouchableOpacity 
            onPress={() => {
              setImage(null);
              setImageSize(0);
            }}
            className="mt-2 flex-row items-center"
          >
            <Ionicons name="trash-outline" size={16} color="red" />
            <Text className="text-red-500 text-sm ml-1">Xóa ảnh</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Form Fields - Giữ nguyên như trước */}
      {/* ... */}
      
      {/* Submit Button */}
      <View className="px-4">
        <TouchableOpacity 
          onPress={handleSubmit}
          className="bg-green-600 p-4 rounded-lg items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-medium">Thêm món ăn</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddDishScreen;
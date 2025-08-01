// app/(app)/merchant/(tabs)/menu/addDish.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { router, useLocalSearchParams } from 'expo-router';
import * as ApiService from '@/components/merchant/menu/ApiService';

const AddDishScreen = () => {
  // Get setCategories from navigation params (from MenuScreen)
  const { setCategories: setParentCategories } = useLocalSearchParams();

  // Form state
  const [formData, setFormData] = useState({
    dishName: '',
    description: '',
    price: '',
    category: '',
    notes: '',
    image: null,
  });
  const [imageSize, setImageSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // Local category options (renamed to avoid conflict)
  const [dishCategories, setDishCategories] = useState([
    { label: 'Đặc sản', value: 'Đặc sản' },
    { label: 'Món chính', value: 'Món chính' },
    { label: 'Đồ uống', value: 'Đồ uống' },
    { label: 'Tạo danh mục mới', value: 'new' },
  ]);

  // Sync categories with ApiService
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await ApiService.fetchCategories();
        setDishCategories([
          ...fetchedCategories.map(cat => ({ label: cat.name, value: cat.name })),
          { label: 'Tạo danh mục mới', value: 'new' },
        ]);
      } catch (error) {
        console.error('Error loading categories:', error);
        Alert.alert('Lỗi', 'Không thể tải danh mục.');
      }
    };
    loadCategories();
  }, []);

  // Check permissions
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

        setFormData({ ...formData, image: selectedImage.uri });
        setImageSize(sizeInMB);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi chọn ảnh');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle category selection
  const handleCategoryChange = (itemValue) => {
    if (itemValue === 'new') {
      setShowNewCategoryInput(true);
      setFormData({ ...formData, category: '' });
    } else {
      setShowNewCategoryInput(false);
      setFormData({ ...formData, category: itemValue });
      setNewCategory('');
    }
  };

  // Function to handle new category input
  const handleNewCategorySubmit = () => {
    if (!newCategory.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục mới');
      return;
    }

    if (dishCategories.some(cat => cat.value.toLowerCase() === newCategory.trim().toLowerCase())) {
      Alert.alert('Lỗi', 'Danh mục này đã tồn tại');
      return;
    }

    const newCategoryValue = newCategory.trim();
    setDishCategories([
      ...dishCategories.filter(cat => cat.value !== 'new'),
      { label: newCategoryValue, value: newCategoryValue },
      { label: 'Tạo danh mục mới', value: 'new' },
    ]);
    setFormData({ ...formData, category: newCategoryValue });
    setNewCategory('');
    setShowNewCategoryInput(false);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.dishName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên món ăn');
      return;
    }

    if (!formData.price.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập giá món ăn');
      return;
    }

    if (!formData.category && !newCategory.trim()) {
      Alert.alert('Lỗi', 'Vui lòng chọn hoặc tạo danh mục');
      return;
    }

    const finalCategory = formData.category || newCategory.trim();
    if (!finalCategory) {
      Alert.alert('Lỗi', 'Vui lòng chọn hoặc tạo danh mục');
      return;
    }

    // Prepare data for API
    const newDish = {
      name: formData.dishName,
      description: formData.description,
      price: formData.price,
      category: finalCategory,
      notes: formData.notes,
      image: formData.image,
    };

    try {
      setIsLoading(true);
      const response = await ApiService.addDish(newDish);

      // Update parent categories (MenuScreen)
      // Note: setParentCategories is a string from params, so we rely on MenuScreen's focus listener
      // Alternatively, we could pass the updated categories back via navigation
      console.log('Updated categories:', response.categories);

      Alert.alert('Thành công', 'Món ăn đã được thêm thành công', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error('Error submitting dish:', error);
      Alert.alert('Lỗi', 'Không thể thêm món ăn. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      dishName: '',
      description: '',
      price: '',
      category: 'Đặc sản',
      notes: '',
      image: null,
    });
    setImageSize(0);
    setNewCategory('');
    setShowNewCategoryInput(false);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="flex-row items-center p-5 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={28} color="gray" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-2xl font-semibold text-gray-800 mr-8">
            Thêm món ăn
          </Text>
        </View>

        <View className="p-4 mx-4 my-4 bg-white rounded-lg border border-gray-200">
          <View className="flex-row">
            <View className="w-1/3 flex items-center justify-center">
              {formData.image ? (
                <Image
                  source={{ uri: formData.image }}
                  className="w-24 h-24 rounded-lg"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Ionicons name="image-outline" size={20} color="gray" />
                </View>
              )}
            </View>
            <View className="w-2/3 pl-3">
              <Text className="text-base font-semibold text-gray-800 mb-2">Thêm món mới</Text>
              {permissionDenied && (
                <Text className="text-red-500 text-xs mb-2">
                  Cần cấp quyền truy cập thư viện ảnh
                </Text>
              )}
              <Text className="text-gray-600 text-sm mb-2">
                Ảnh chất lượng cao, tối đa 2MB, định dạng PNG, JPEG
              </Text>
              <TouchableOpacity
                onPress={pickImage}
                className="border border-gray-300 rounded-lg px-3 py-1.5 flex-row items-center justify-center"
                disabled={isLoading || permissionDenied}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={18} color="gray" className="mr-1" />
                    <Text className="text-gray-800 text-sm">Thêm ảnh</Text>
                  </>
                )}
              </TouchableOpacity>
              {formData.image && (
                <Text className="text-gray-500 text-xs mt-1">
                  Kích thước: {imageSize.toFixed(2)} MB
                </Text>
              )}
              {formData.image && (
                <TouchableOpacity
                  onPress={() => {
                    setFormData({ ...formData, image: null });
                    setImageSize(0);
                  }}
                  className="mt-1 flex-row items-center"
                >
                  <Ionicons name="trash-outline" size={14} color="red" />
                  <Text className="text-red-500 text-xs ml-1">Xóa ảnh</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View className="p-5 mx-4 my-2 bg-white rounded-lg border border-gray-200">
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 text-base"
            style={{ height: 52 }}
            placeholder="Tên món ăn"
            value={formData.dishName}
            onChangeText={(text) => setFormData({ ...formData, dishName: text })}
          />
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 text-base"
            style={{ height: 52 }}
            placeholder="Mô tả"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
          />
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 text-base"
            style={{ height: 52 }}
            placeholder="Giá"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            keyboardType="numeric"
          />
          <View className="border border-gray-300 rounded-lg mb-4">
            <Picker
              selectedValue={showNewCategoryInput ? 'new' : formData.category}
              onValueChange={handleCategoryChange}
              style={{
                height: 52,
                paddingHorizontal: 12,
                fontSize: 14,
              }}
              itemStyle={{ fontSize: 14 }}
              dropdownIconColor="#6b7280"
            >
              {dishCategories.map((cat, index) => (
                <Picker.Item key={index} label={cat.label} value={cat.value} />
              ))}
            </Picker>
          </View>
          {showNewCategoryInput && (
            <View className="flex-row items-center mb-4">
              <TextInput
                className="flex-1 border border-gray-300 rounded-lg p-3 text-base"
                style={{ height: 52 }}
                placeholder="Nhập tên danh mục mới"
                value={newCategory}
                onChangeText={setNewCategory}
              />
              <TouchableOpacity
                onPress={handleNewCategorySubmit}
                className="ml-2 bg-green-600 p-3 rounded-lg"
              >
                <Ionicons name="checkmark" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 text-base"
            style={{ height: 52 }}
            placeholder="Ghi chú"
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            multiline
          />
        </View>
      </ScrollView>

      <View className="bg-white p-4">
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
    </View>
  );
};

export default AddDishScreen;
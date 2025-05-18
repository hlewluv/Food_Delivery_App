import React from 'react';
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
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as ApiService from '../ApiService';

// Define interfaces
interface Option {
  name: string;
  price: string;
}

interface OptionGroup {
  groupName: string;
  options: Option[];
}

interface Dish {
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
  optionGroups: OptionGroup[];
  category: string;
}

interface Category {
  name: string;
  count: number;
  dishes: Dish[];
}

interface AddDishModalProps {
  showAddDishModal: boolean;
  setShowAddDishModal: (value: boolean) => void;
  addDishData: Dish;
  setAddDishData: (value: Dish) => void;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  permissionDenied: boolean;
  setPermissionDenied: (value: boolean) => void;
  setShowAddCategoryModal: (value: boolean) => void;
}

const AddDishModal: React.FC<AddDishModalProps> = ({
  showAddDishModal,
  setShowAddDishModal,
  addDishData,
  setAddDishData,
  categories,
  setCategories,
  isLoading,
  setIsLoading,
  permissionDenied,
  setPermissionDenied,
  setShowAddCategoryModal,
}) => {
  const pickImage = async () => {
    setIsLoading(true);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setPermissionDenied(true);
      Alert.alert('Quyền bị từ chối', 'Cần quyền truy cập thư viện ảnh!');
      setIsLoading(false);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setAddDishData({ ...addDishData, image: result.assets[0].uri });
    }
    setIsLoading(false);
  };

  const saveNewDish = async () => {
    if (
      !addDishData.name ||
      !addDishData.price ||
      !addDishData.category ||
      addDishData.category === 'add_new_category'
    ) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tên món, giá và chọn danh mục hợp lệ!');
      return;
    }
    setIsLoading(true);
    try {
      const result = await ApiService.addDish(addDishData);
      setCategories(result.categories);
      setAddDishData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?20210521171500',
        optionGroups: [],
        available: false,
      });
      setShowAddDishModal(false);
      Alert.alert('Thành công', 'Đã thêm món ăn mới!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm món ăn!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={showAddDishModal}
      animationType="slide"
      onRequestClose={() => setShowAddDishModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowAddDishModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <View
              className="bg-white rounded-lg overflow-hidden"
              style={{ width: 620, height: 620, maxWidth: '90%', maxHeight: '90%' }}
            >
              <View className="p-5 border-b border-gray-200">
                <Text className="text-lg font-semibold text-gray-800">Thêm món ăn mới</Text>
              </View>
              <View className="flex-row p-5" style={{ height: 548 }}>
                <View className="w-1/3 pr-4 flex justify-start pt-10">
                  <View className="items-center" style={{ marginTop: 20 }}>
                    <View className="relative mb-2">
                      <Image
                        source={{ uri: addDishData.image || 'https://via.placeholder.com/200x160' }}
                        style={{ width: 200, height: 160, borderRadius: 8, backgroundColor: '#f3f4f6', marginTop: 10 }}
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
                        backgroundColor: isLoading || permissionDenied ? '#f3f4f6' : 'white',
                        marginTop: 8,
                      }}
                      disabled={isLoading || permissionDenied}
                    >
                      <Ionicons
                        name="cloud-upload-outline"
                        size={16}
                        color={isLoading || permissionDenied ? '#9ca3af' : '#4b5563'}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={{ fontSize: 14, color: isLoading || permissionDenied ? '#9ca3af' : '#374151' }}
                      >
                        Chọn ảnh
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView
                  className="w-2/3 pl-4"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20, paddingLeft: 20 }}
                >
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 }}>
                      Tên món ăn
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
                      placeholder="Nhập tên món ăn"
                      value={addDishData.name}
                      onChangeText={(text: string) => setAddDishData({ ...addDishData, name: text })}
                    />
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 }}>
                      Mô tả
                    </Text>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        fontSize: 14,
                        height: 80,
                        textAlignVertical: 'top',
                      }}
                      placeholder="Nhập mô tả món ăn"
                      value={addDishData.description}
                      onChangeText={(text: string) => setAddDishData({ ...addDishData, description: text })}
                      multiline
                    />
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 }}>
                      Giá tiền
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
                      placeholder="Nhập giá tiền"
                      value={addDishData.price}
                      onChangeText={(text: string) => setAddDishData({ ...addDishData, price: text })}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 }}>
                      Danh mục
                    </Text>
                    <View style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8 }}>
                      <Picker
                        selectedValue={addDishData.category}
                        onValueChange={(itemValue: string) => {
                          if (itemValue === 'add_new_category') {
                            setShowAddCategoryModal(true);
                            setAddDishData({ ...addDishData, category: '' });
                          } else {
                            setAddDishData({ ...addDishData, category: itemValue });
                          }
                        }}
                        style={{ height: 44, paddingHorizontal: 12, fontSize: 14 }}
                        itemStyle={{ fontSize: 14 }}
                        dropdownIconColor="#6b7280"
                      >
                        <Picker.Item label="-- Chọn danh mục --" value="" />
                        {categories.map((category: Category, index: number) => (
                          <Picker.Item key={index} label={category.name} value={category.name} />
                        ))}
                        <Picker.Item label="Thêm danh mục mới" value="add_new_category" />
                      </Picker>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                      onPress={saveNewDish}
                      style={{
                        flex: 1,
                        backgroundColor: '#16a34a',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: 'white', fontWeight: '500', fontSize: 14 }}>Thêm món</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setShowAddDishModal(false)}
                      style={{
                        flex: 1,
                        backgroundColor: '#6b7280',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
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
    </Modal>
  );
};

export default AddDishModal;
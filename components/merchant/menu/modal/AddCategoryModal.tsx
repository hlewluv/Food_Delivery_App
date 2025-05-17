import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput } from 'react-native';
import { Alert } from 'react-native';
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

interface AddCategoryModalProps {
  showAddCategoryModal: boolean;
  setShowAddCategoryModal: (value: boolean) => void;
  addCategoryName: string;
  setAddCategoryName: (value: string) => void;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  showAddDishModal: boolean;
  addDishData: Dish;
  setAddDishData: (value: Dish) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  showAddCategoryModal,
  setShowAddCategoryModal,
  addCategoryName,
  setAddCategoryName,
  categories,
  setCategories,
  showAddDishModal,
  addDishData,
  setAddDishData,
  isLoading,
  setIsLoading,
}) => {
  const saveNewCategory = async () => {
    if (!addCategoryName.trim()) {
      Alert.alert('Lỗi', 'Tên danh mục không được để trống!');
      return;
    }
    setIsLoading(true);
    try {
      const result = await ApiService.addCategory(addCategoryName);
      setCategories(result.categories);
      if (showAddDishModal) {
        setAddDishData({ ...addDishData, category: addCategoryName.trim() });
      }
      setAddCategoryName('');
      setShowAddCategoryModal(false);
      Alert.alert('Thành công', 'Đã thêm danh mục mới!');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể thêm danh mục!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={showAddCategoryModal}
      animationType="slide"
      onRequestClose={() => setShowAddCategoryModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowAddCategoryModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <View
              className="bg-white rounded-lg overflow-hidden"
              style={{ width: 620, height: 620, maxWidth: '90%', maxHeight: '90%' }}
            >
              <View className="p-5 border-b border-gray-200">
                <Text className="text-xl font-semibold text-gray-800">Thêm danh mục mới</Text>
              </View>
              <View className="p-5" style={{ height: 548 }}>
                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Tên danh mục</Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg text-sm"
                    placeholder="Nhập tên danh mục"
                    value={addCategoryName}
                    onChangeText={(text: string) => setAddCategoryName(text)}
                  />
                </View>
                <View className="flex-row space-x-4 mt-auto">
                  <TouchableOpacity
                    onPress={saveNewCategory}
                    className="flex-1 bg-green-600 px-4 py-3 rounded-lg items-center justify-center"
                  >
                    <Text className="text-white font-medium text-sm">Thêm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowAddCategoryModal(false)}
                    className="flex-1 bg-gray-300 px-4 py-3 rounded-lg items-center justify-center"
                  >
                    <Text className="text-gray-800 font-medium text-sm">Hủy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddCategoryModal;
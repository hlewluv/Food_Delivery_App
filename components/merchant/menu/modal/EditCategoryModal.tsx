import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput } from 'react-native';
import { Alert } from 'react-native';

// Define interfaces
interface Dish {
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
  optionGroups: any[];
  category: string;
}

interface Category {
  name: string;
  count: number;
  dishes: Dish[];
}

interface EditCategoryModalProps {
  showEditCategoryModal: boolean;
  setShowEditCategoryModal: (value: boolean) => void;
  selectedCategory: number | null;
  setSelectedCategory: (value: number | null) => void;
  editCategoryName: string;
  setEditCategoryName: (value: string) => void;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  showEditCategoryModal,
  setShowEditCategoryModal,
  selectedCategory,
  setSelectedCategory,
  editCategoryName,
  setEditCategoryName,
  categories,
  setCategories,
}) => {
  const saveCategoryChanges = () => {
    if (!editCategoryName.trim()) {
      Alert.alert('Lỗi', 'Tên danh mục không được để trống!');
      return;
    }
    if (selectedCategory === null) return;
    const updatedCategories = [...categories];
    updatedCategories[selectedCategory].name = editCategoryName.trim();
    setCategories(updatedCategories);
    setShowEditCategoryModal(false);
    setSelectedCategory(null);
    setEditCategoryName('');
  };

  const deleteCategory = () => {
    if (selectedCategory === null) return;
    if (categories[selectedCategory].count > 0) {
      Alert.alert('Lỗi', 'Chỉ có thể xóa danh mục khi không còn món ăn nào!');
      return;
    }
    const updatedCategories = categories.filter((_: Category, index: number) => index !== selectedCategory);
    setCategories(updatedCategories);
    setShowEditCategoryModal(false);
    setSelectedCategory(null);
    setEditCategoryName('');
  };

  return (
    <Modal
      transparent={true}
      visible={showEditCategoryModal}
      animationType="slide"
      onRequestClose={() => setShowEditCategoryModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowEditCategoryModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <View
              className="bg-white rounded-lg overflow-hidden"
              style={{ width: 620, height: 620, maxWidth: '90%', maxHeight: '90%' }}
            >
              <View className="p-5 border-b border-gray-200">
                <Text className="text-xl font-semibold text-gray-800">Chỉnh sửa danh mục</Text>
              </View>
              <View className="p-5" style={{ height: 548 }}>
                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Tên danh mục</Text>
                  <TextInput
                    className="border border-gray-300 p-3 rounded-lg text-sm"
                    placeholder="Nhập tên danh mục"
                    value={editCategoryName}
                    onChangeText={(text: string) => setEditCategoryName(text)}
                  />
                </View>
                <View className="flex-row space-x-4 mt-auto">
                  <TouchableOpacity
                    onPress={saveCategoryChanges}
                    className="flex-1 bg-green-600 px-4 py-3 rounded-lg items-center justify-center"
                  >
                    <Text className="text-white font-medium text-sm">Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={deleteCategory}
                    className={`flex-1 px-4 py-3 rounded-lg items-center justify-center ${
                      selectedCategory !== null && categories[selectedCategory]?.count === 0
                        ? 'bg-red-600'
                        : 'bg-gray-300'
                    }`}
                    disabled={selectedCategory !== null && categories[selectedCategory]?.count > 0}
                  >
                    <Text
                      className={`font-medium text-sm ${
                        selectedCategory !== null && categories[selectedCategory]?.count === 0
                          ? 'text-white'
                          : 'text-gray-600'
                      }`}
                    >
                      Xóa
                    </Text>
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

export default EditCategoryModal;

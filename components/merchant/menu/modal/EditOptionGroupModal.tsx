import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

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

interface EditOptionGroupModalProps {
  showEditOptionGroupModal: boolean;
  setShowEditOptionGroupModal: (value: boolean) => void;
  selectedOptionGroup: number | null;
  setSelectedOptionGroup: (value: number | null) => void;
  editOptionGroupData: OptionGroup;
  setEditOptionGroupData: (value: OptionGroup) => void;
  optionGroups: OptionGroup[];
  setOptionGroups: React.Dispatch<React.SetStateAction<OptionGroup[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const EditOptionGroupModal: React.FC<EditOptionGroupModalProps> = ({
  showEditOptionGroupModal,
  setShowEditOptionGroupModal,
  selectedOptionGroup,
  setSelectedOptionGroup,
  editOptionGroupData,
  setEditOptionGroupData,
  optionGroups,
  setOptionGroups,
  categories,
  setCategories,
}) => {
  const saveOptionGroupChanges = () => {
    if (!editOptionGroupData.groupName.trim()) {
      Alert.alert('Lỗi', 'Tên nhóm tùy chọn không được để trống!');
      return;
    }
    if (selectedOptionGroup === null) return;
    const updatedOptionGroups = [...optionGroups];
    updatedOptionGroups[selectedOptionGroup] = { ...editOptionGroupData };
    setOptionGroups(updatedOptionGroups);
    const updatedCategories = [...categories];
    updatedCategories.forEach((category: Category) => {
      category.dishes.forEach((dish: Dish) => {
        dish.optionGroups = dish.optionGroups.map((group: OptionGroup) =>
          group.groupName === editOptionGroupData.groupName ? editOptionGroupData : group
        );
      });
    });
    setCategories(updatedCategories);
    setShowEditOptionGroupModal(false);
    setSelectedOptionGroup(null);
    setEditOptionGroupData({ groupName: '', options: [] });
    Alert.alert('Thành công', 'Đã lưu thay đổi nhóm tùy chọn!');
  };

  const addNewOptionToGroup = () => {
    setEditOptionGroupData({
      ...editOptionGroupData,
      options: [...editOptionGroupData.options, { name: '', price: '' }],
    });
  };

  const updateOptionInGroup = (index: number, field: 'name' | 'price', value: string) => {
    const updatedOptions = [...editOptionGroupData.options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setEditOptionGroupData({ ...editOptionGroupData, options: updatedOptions });
  };

  const removeOptionFromGroup = (index: number) => {
    const updatedOptions = editOptionGroupData.options.filter((_: Option, i: number) => i !== index);
    setEditOptionGroupData({ ...editOptionGroupData, options: updatedOptions });
  };

  return (
    <Modal
      transparent={true}
      visible={showEditOptionGroupModal}
      animationType="slide"
      onRequestClose={() => setShowEditOptionGroupModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowEditOptionGroupModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <View
              className="bg-white rounded-lg overflow-hidden"
              style={{ width: 620, height: 620, maxWidth: '90%', maxHeight: '90%' }}
            >
              <View className="p-5 border-b border-gray-200">
                <Text className="text-xl font-semibold text-gray-800">Chỉnh sửa nhóm tùy chọn</Text>
              </View>
              <View className="p-5" style={{ height: 548 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Tên nhóm tùy chọn</Text>
                    <TextInput
                      className="border border-gray-300 p-3 rounded-lg text-sm"
                      placeholder="Nhập tên nhóm tùy chọn"
                      value={editOptionGroupData.groupName}
                      onChangeText={(text: string) =>
                        setEditOptionGroupData({ ...editOptionGroupData, groupName: text })
                      }
                    />
                  </View>
                  <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Tùy chọn</Text>
                    <View className="space-y-3">
                      {editOptionGroupData.options.map((option: Option, index: number) => (
                        <View
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-gray-800">Tùy chọn {index + 1}</Text>
                            <TouchableOpacity onPress={() => removeOptionFromGroup(index)}>
                              <Ionicons name="trash-outline" size={20} color="red" />
                            </TouchableOpacity>
                          </View>
                          <View className="space-y-2">
                            <TextInput
                              className="border border-gray-300 p-2 rounded-lg text-sm"
                              placeholder="Tên tùy chọn"
                              value={option.name}
                              onChangeText={(text: string) => updateOptionInGroup(index, 'name', text)}
                            />
                            <TextInput
                              className="border border-gray-300 p-2 rounded-lg text-sm"
                              placeholder="Giá (VNĐ)"
                              value={option.price}
                              onChangeText={(text: string) => updateOptionInGroup(index, 'price', text)}
                              keyboardType="numeric"
                            />
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={addNewOptionToGroup}
                    className="border border-gray-300 rounded-lg px-3 py-2 flex-row items-center justify-center mb-6"
                  >
                    <Ionicons name="add" size={18} color="blue" className="mr-2" />
                    <Text className="text-gray-800 text-sm">Thêm tùy chọn mới</Text>
                  </TouchableOpacity>
                </ScrollView>
                <View className="flex-row space-x-4">
                  <TouchableOpacity
                    onPress={saveOptionGroupChanges}
                    className="flex-1 bg-green-600 px-4 py-3 rounded-lg items-center justify-center"
                  >
                    <Text className="text-white font-medium text-sm">Lưu</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowEditOptionGroupModal(false)}
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

export default EditOptionGroupModal;
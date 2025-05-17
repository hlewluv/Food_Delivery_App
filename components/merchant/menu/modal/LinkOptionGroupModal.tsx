import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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

interface LinkOptionGroupModalProps {
  showLinkModal: boolean;
  setShowLinkModal: (value: boolean) => void;
  selectedCategoryForLink: string;
  setSelectedCategoryForLink: (value: string) => void;
  optionGroups: OptionGroup[];
  editDishData: Dish;
  setEditDishData: (value: Dish) => void;
}

const LinkOptionGroupModal: React.FC<LinkOptionGroupModalProps> = ({
  showLinkModal,
  setShowLinkModal,
  selectedCategoryForLink,
  setSelectedCategoryForLink,
  optionGroups,
  editDishData,
  setEditDishData,
}) => {
  const saveLink = () => {
    if (!selectedCategoryForLink) {
      Alert.alert('Lỗi', 'Vui lòng chọn một nhóm tùy chọn để liên kết!');
      return;
    }
    const selectedGroup = optionGroups.find((group) => group.groupName === selectedCategoryForLink);
    if (selectedGroup) {
      if (!editDishData.optionGroups.some((group) => group.groupName === selectedGroup.groupName)) {
        setEditDishData({
          ...editDishData,
          optionGroups: [...editDishData.optionGroups, selectedGroup],
        });
      }
    }
    setShowLinkModal(false);
    setSelectedCategoryForLink('');
    Alert.alert('Thành công', 'Đã liên kết nhóm tùy chọn với món ăn!');
  };

  return (
    <Modal
      transparent={true}
      visible={showLinkModal}
      animationType="slide"
      onRequestClose={() => setShowLinkModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowLinkModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <TouchableWithoutFeedback>
            <View
              className="bg-white rounded-lg overflow-hidden"
              style={{ width: 620, height: 620, maxWidth: '90%', maxHeight: '90%' }}
            >
              <View className="p-5 border-b border-gray-200">
                <Text className="text-xl font-semibold text-gray-800">Liên kết nhóm tùy chọn</Text>
              </View>
              <View className="p-5" style={{ height: 548 }}>
                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-700 mb-2">Chọn nhóm tùy chọn</Text>
                  <View className="border border-gray-300 rounded-lg">
                    <Picker
                      selectedValue={selectedCategoryForLink}
                      onValueChange={(itemValue: string) => setSelectedCategoryForLink(itemValue)}
                      style={{ height: 52, paddingHorizontal: 12, fontSize: 14 }}
                      itemStyle={{ fontSize: 14 }}
                      dropdownIconColor="#6b7280"
                    >
                      <Picker.Item label="-- Chọn nhóm tùy chọn --" value="" />
                      {optionGroups.map((group: OptionGroup, index: number) => (
                        <Picker.Item key={index} label={group.groupName} value={group.groupName} />
                      ))}
                    </Picker>
                  </View>
                </View>
                <View className="flex-row space-x-4 mt-auto">
                  <TouchableOpacity
                    onPress={saveLink}
                    className="flex-1 bg-green-600 px-4 py-3 rounded-lg items-center justify-center"
                  >
                    <Text className="text-white font-medium text-sm">Liên kết</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowLinkModal(false)}
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

export default LinkOptionGroupModal;
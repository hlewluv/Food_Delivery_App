import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

interface OptionGroup {
  groupName: string;
  options: { name: string; price: string }[];
}

interface OptionGroupsListProps {
  optionGroups: OptionGroup[];
  expandedOptionGroups: string[];
  toggleOptionGroup: (groupName: string) => void;
  handleEditOptionGroup: (groupIndex: number) => void;
  setOptionGroups: React.Dispatch<React.SetStateAction<OptionGroup[]>>;
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;
}

const OptionGroupsList: React.FC<OptionGroupsListProps> = ({
  optionGroups,
  expandedOptionGroups,
  toggleOptionGroup,
  handleEditOptionGroup,
  setOptionGroups,
  setCategories,
}) => {
  const handleDeleteOptionGroup = (groupIndex: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa nhóm tùy chọn này? Nhóm sẽ bị xóa khỏi tất cả món ăn đã liên kết.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            const groupNameToDelete = optionGroups[groupIndex].groupName;
            const updatedOptionGroups = optionGroups.filter((_, index) => index !== groupIndex);
            setOptionGroups(updatedOptionGroups);
            setCategories((prevCategories) =>
              prevCategories.map((category) => ({
                ...category,
                dishes: category.dishes.map((dish) => ({
                  ...dish,
                  optionGroups: dish.optionGroups.filter(
                    (group) => group.groupName !== groupNameToDelete
                  ),
                })),
              }))
            );
            Alert.alert('Thành công', 'Đã xóa nhóm tùy chọn!');
          },
        },
      ]
    );
  };

  return (
    <View className="px-4 pb-20">
      <View className="flex-row justify-between items-center mb-4 mt-2">
        <Text className="text-2xl font-semibold text-gray-800">Nhóm tùy chọn</Text>
      </View>
      {optionGroups.map((group, groupIndex) => (
        <View
          key={groupIndex}
          className="mb-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <TouchableOpacity
            onPress={() => toggleOptionGroup(group.groupName)}
            className="flex-row justify-between items-center p-5"
            activeOpacity={0.8}>
            <View className="flex-row items-center">
              <Ionicons
                name={
                  expandedOptionGroups.includes(group.groupName) ? 'chevron-down' : 'chevron-forward'
                }
                size={20}
                color="gray"
                className="mr-3"
              />
              <Text className="text-lg font-medium text-gray-800">{group.groupName}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-gray-600 mr-3">{group.options.length} tùy chọn</Text>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => handleEditOptionGroup(groupIndex)}
                  className="p-1 mr-2">
                  <Ionicons name="pencil" size={20} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteOptionGroup(groupIndex)}
                  className="p-1">
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
          {expandedOptionGroups.includes(group.groupName) && (
            <View className="px-5 pb-3">
              {group.options.map((option, optionIndex) => (
                <View
                  key={optionIndex}
                  className="p-3 mb-3 border-t border-gray-100 flex-row justify-between">
                  <Text className="text-gray-800">{option.name}</Text>
                  <Text className="text-green-600">{option.price} VNĐ</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default OptionGroupsList;
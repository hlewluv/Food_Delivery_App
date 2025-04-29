import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SectionItem {
  id: string;
  title: string;
  rightContent?: React.ReactNode;
  onPress?: () => void;
}

interface SectionListProps {
  title: string;
  items: SectionItem[];
  containerClassName?: string;
  itemContainerClassName?: string;
}

const SectionList: React.FC<SectionListProps> = ({
  title,
  items,
  containerClassName = 'bg-white rounded-lg ',
  itemContainerClassName = 'px-4 py-4',
}) => (
  <View className="px-4 py-4 bg-white">
    <Text className="text-lg font-bold text-gray-800 mb-1 px-4">{title}</Text>
    <View className={containerClassName}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && <View className="border-t border-gray-200 mx-4" />}
          <TouchableOpacity
            className={`flex-row justify-between items-center ${itemContainerClassName}`}
            onPress={item.onPress}
          >
            <View className="flex-1">
              <Text className="text-base text-gray-800">{item.title}</Text>
            </View>
            <View className="flex-row items-center">
              {item.rightContent || (
                <MaterialIcons name="keyboard-arrow-right" size={20} color="#666" />
              )}
            </View>
          </TouchableOpacity>
        </React.Fragment>
      ))}
    </View>
  </View>
);

export default SectionList;
import React from 'react';
import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface SectionHeaderProps {
  title?: string;
  onPress?: TouchableOpacityProps['onPress']; // Sử dụng kiểu từ TouchableOpacity
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title = "Special Offers", 
  onPress 
}) => {
  return (
    <View className="flex-row items-center justify-between mx-10 my-2">
      <Text 
        className="text-lg font-semibold text-gray-900" 
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
      
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={onPress}
        className="flex-row items-center"
      >
        <Text className="text-base text-primary font-medium mr-1">See All</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SectionHeader;
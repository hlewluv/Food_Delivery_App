import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface HeaderProps {
  userName?: string;
  branchName?: string;
  archiveCount?: string;
}

const Header: React.FC<HeaderProps> = ({
  userName = 'Hoang Le',
  branchName = 'Coffee Cafe & Roasters, Ho Chi Minh',
  archiveCount = '17.1k',
}) => (
  <View className="bg-white px-3 pt-5 pb-3">
    <View className="flex-row justify-between items-start">
      <View className="flex-row items-baseline">
        <Text className="text-xl font-bold mr-2">Chào bạn trở lại!</Text>
        <Text className="text-3xl font-bold">{userName}</Text>
      </View>
    </View>
    <View className="flex-row items-center mt-2">
      <Text className="text-lg mr-2">{branchName}</Text>
      <Feather name="chevron-down" size={20} color="#6b7280" />
    </View>
    <View className="flex-row items-center mt-2">
      <Feather name="archive" size={16} color="#6b7280" />
      <Text className="text-gray-500 ml-1">{archiveCount}</Text>
    </View>
  </View>
);

export default Header;
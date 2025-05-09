import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvatarHeaderProps {
  user: {
    name: string;
    avatar: any;
    membership?: {
      type: 'basic' | 'vip';
    };
  };
  onProfilePress?: () => void;
}

const AvatarHeader: React.FC<AvatarHeaderProps> = ({ user, onProfilePress }) => (
  <View className="px-5 pb-2 flex-row items-start justify-between">
    <View className="flex-row items-start">
      <View className="relative">
        <Image
          source={user.avatar}
          className="w-20 h-20 rounded-lg border-4 border-white shadow-md"
          resizeMode="cover"
        />
        {user.membership?.type === 'vip' && (
          <View className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
            <Ionicons name="diamond" size={16} color="white" />
          </View>
        )}
      </View>

      <View className="ml-4 mt-1">
        <Text className="text-2xl font-bold text-gray-900">{user.name}</Text>
        <Text className="text-gray-500">Thành viên VIP</Text>
      </View>
    </View>
    <TouchableOpacity
      className="px-4 py-2 bg-white rounded-full border border-gray-300 self-start shadow-sm active:bg-gray-50"
      onPress={onProfilePress}
    >
      <Text className="text-gray-700 font-medium text-sm">Hồ sơ</Text>
    </TouchableOpacity>
  </View>
);

export default AvatarHeader;
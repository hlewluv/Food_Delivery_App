import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

interface DualButtonsProps {
  onBecomeMuncherPress?: () => void;
  onBusinessPress?: () => void;
}

const DualButtons: React.FC<DualButtonsProps> = ({ onBecomeMuncherPress, onBusinessPress }) => (
  <View className="flex-row justify-between" style={{ gap: 5 }}>
    <TouchableOpacity
      className="flex-1 p-3 bg-white rounded-2xl border border-gray-200 flex-row justify-between items-center shadow-sm"
      activeOpacity={0.9}
      style={{ height: 60 }}
      onPress={onBecomeMuncherPress}
    >
      <Text className="text-base font-medium text-gray-800">Trở thành Muncher</Text>
      <View className="relative">
        <View
          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
          style={{ width: 34, height: 34 }}
        />
        <MaterialCommunityIcons
          name="motorbike"
          size={22}
          color="#6366f1"
          style={{ margin: 6 }}
        />
      </View>
    </TouchableOpacity>

    <TouchableOpacity
      className="flex-1 p-3 bg-white rounded-2xl border border-gray-200 flex-row justify-between items-center shadow-sm"
      activeOpacity={0.9}
      style={{ height: 60 }}
      onPress={onBusinessPress}
    >
      <Text className="text-base font-medium text-gray-800">Làm doanh nghiệp</Text>
      <View className="relative">
        <View
          className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-20"
          style={{ width: 34, height: 34 }}
        />
        <MaterialIcons
          name="business-center"
          size={22}
          color="#10b981"
          style={{ margin: 6 }}
        />
      </View>
    </TouchableOpacity>
  </View>
);

export default DualButtons;
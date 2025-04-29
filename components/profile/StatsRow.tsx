import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome } from '@expo/vector-icons';

interface StatsRowProps {
  onDiscountPress?: () => void;
  onVipPress?: () => void;
  onFavoritesPress?: () => void;
  discountCount?: number;
  favoriteCount?: number;
}

const StatsRow: React.FC<StatsRowProps> = ({
  onDiscountPress,
  onVipPress,
  onFavoritesPress,
  discountCount = 0,
  favoriteCount = 0,
}) => {
  // Màu sắc được định nghĩa tập trung để dễ quản lý
  const COLORS = {
    discount: {
      primary: '#ef4444',
      background: '#fef2f2',
    },
    vip: {
      primary: '#d97706',
      background: '#fffbeb',
    },
    favorite: {
      primary: '#059669',
      background: '#ecfdf5',
    },
  };

  return (
    <View className="flex-row justify-between px-5 py-3 bg-white border-gray-100">
      {/* Discount Button */}
      <StatButton
        icon={<MaterialCommunityIcons name="ticket-percent" size={20} color={COLORS.discount.primary} />}
        value={discountCount.toString()}
        label="Giảm giá"
        color={COLORS.discount}
        onPress={onDiscountPress}
      />

      {/* VIP Button */}
      <StatButton
        icon={<Ionicons name="diamond" size={18} color={COLORS.vip.primary} />}
        value="VIP"
        label="Ưu đãi"
        color={COLORS.vip}
        onPress={onVipPress}
      />

      {/* Favorite Button */}
      <StatButton
        icon={<FontAwesome name="heart" size={18} color={COLORS.favorite.primary} />}
        value={favoriteCount.toString()}
        label="Yêu thích"
        color={COLORS.favorite}
        onPress={onFavoritesPress}
      />
    </View>
  );
};

// Sub-component để tái sử dụng code
const StatButton = ({
  icon,
  value,
  label,
  color,
  onPress,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: { primary: string; background: string };
  onPress?: () => void;
}) => (
  <TouchableOpacity
    className="items-center justify-center flex-1 mx-1"
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View 
      className="items-center justify-center p-1 rounded-xl w-full"
      style={{ backgroundColor: color.background }}
    >
      <View className="flex-row items-center">
        {icon}
        <Text 
          className="text-lg font-semibold ml-2"
          style={{ color: color.primary }}
        >
          {value}
        </Text>
      </View>
      <Text className="text-gray-500 text-xs font-medium">{label}</Text>
    </View>
  </TouchableOpacity>
);

export default StatsRow;
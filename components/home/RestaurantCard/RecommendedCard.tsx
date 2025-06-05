import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { icons } from '@/constant/icons';
import { useRouter } from 'expo-router';
import { RestaurantRecommend } from '@/apis/restaurants/types';

interface RecommendedCardProps {
  item: RestaurantRecommend;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
  onPress?: (restaurant: RestaurantRecommend) => void;
}

const RecommendedCard: React.FC<RecommendedCardProps> = ({ 
  item, 
  isLiked, 
  onToggleLike,
  onPress
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    } else {
      router.push({
        pathname: '/customer/restaurants/[id]',
        params: {
          id: item.id,
        }
      });
    }
  };

  const handleLikePress = (e: any) => {
    e.stopPropagation();
    onToggleLike(item.id);
  };

  return (
    <TouchableOpacity
      className="flex-row items-center my-4 mx-6 bg-white rounded-lg shadow-sm p-3"
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.image }}
        className="w-20 h-20 rounded-xl"
        resizeMode="cover"
      />

      <View className="ml-3 flex-1">
        <Text className="font-semibold text-gray-900 text-base" numberOfLines={1}>
          {item.name}
        </Text>

        <View className="flex-row items-center mt-1">
          {item.rating !== null && item.rating !== undefined && (
            <>
              <Image
                source={icons.star}
                className="w-5 h-5 mr-1"
                style={{ tintColor: '#FFD700' }}
              />
              <Text className="text-gray-700 text-sm">{item.rating.toFixed(1)}</Text>
              <Text className="text-gray-500 text-sm mx-1">•</Text>
            </>
          )}
          <Image
            source={icons.clock}
            className="w-4 h-4 mr-1"
            style={{ tintColor: '#6B7280' }}
          />
          <Text className="text-gray-700 text-sm">{item.time}</Text>
        </View>

        {item.category && (
          <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
            {item.category}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={handleLikePress}>
        <Image
          source={isLiked ? icons.heart1 : icons.heart}
          className="w-6 h-6"
          style={{ tintColor: isLiked ? '#00b14f' : '#808080' }}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default React.memo(RecommendedCard);

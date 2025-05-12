import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import SectionHeader from '@/components/SectionHeader';
import RecommendedCard from '../RestaurantCard/RecommendedCard';
import { getRestaurants } from '@/apis/restaurants/RecommendedList';
import { RestaurantRecommend } from '@/apis/restaurants/types';

interface RecommendedListProps {
  likedRestaurants: Record<string, boolean>;
  toggleLike: (id: string) => void;
  onRestaurantPress?: (restaurant: RestaurantRecommend) => void;
  categoryId?: string;
}

const RecommendedList = ({ 
  likedRestaurants, 
  toggleLike, 
  onRestaurantPress,
  categoryId
}: RecommendedListProps) => {
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<RestaurantRecommend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendedRestaurants = async () => {
      try {
        setLoading(true);
        const restaurants = await getRestaurants(categoryId);
        setRecommendedRestaurants(restaurants);
      } catch (err) {
        setError('Không thể tải dữ liệu nhà hàng');
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedRestaurants();
  }, [categoryId]);

  if (loading) {
    return (
      <View className="mt-4">
        <SectionHeader title={categoryId ? 'Đề xuất trong mục này' : 'Nhà hàng đề xuất'} />
        <ActivityIndicator className="py-4" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="mt-4">
        <SectionHeader title={categoryId ? 'Đề xuất trong mục này' : 'Nhà hàng đề xuất'} />
        <Text className="text-center text-red-500 py-4">{error}</Text>
      </View>
    );
  }

  return (
    <View className="mt-4">
      <SectionHeader 
        title={categoryId ? 'Đề xuất trong mục này' : 'Nhà hàng đề xuất'} 
      />
      
      <FlatList
        data={recommendedRestaurants}
        renderItem={({ item }) => (
          <RecommendedCard
            item={item}
            isLiked={likedRestaurants[item.id] || false}
            onToggleLike={() => toggleLike(item.id)}
            onPress={() => onRestaurantPress?.(item)}
          />
        )}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 py-4">Không có nhà hàng nào</Text>
        }
      />
    </View>
  );
};

export default React.memo(RecommendedList);
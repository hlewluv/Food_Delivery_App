import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import SectionHeader from '@/components/SectionHeader';
import RecommendedCard from '../RestaurantCard/RecommendedCard';
import { getRestaurants } from '@/apis/restaurants/RecommendedList';
import { RestaurantRecommend } from '@/apis/restaurants/types';
import { getRestaurantDetail } from '@/apis/restaurants/RestaurantDetail';
import { router } from 'expo-router';

interface RecommendedListProps {
  likedRestaurants: Record<string, boolean>;
  toggleLike: (id: string) => void;
  categoryId?: string;
}

const RecommendedList = ({ 
  likedRestaurants, 
  toggleLike, 
  categoryId
}: RecommendedListProps) => {
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<RestaurantRecommend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRestaurantPress = async (item: RestaurantRecommend) => {
    try {
      // Fetch restaurant details before navigation
      const restaurantDetails = await getRestaurantDetail(item.id);
      console.log(restaurantDetails);

      router.push({
        pathname: `/customer/restaurants/[id]`,
        params: {
          id: JSON.stringify(item.id),
          restaurant: JSON.stringify(item), // Pass the basic restaurant info
          restaurantDetails: JSON.stringify(restaurantDetails) // Pass the detailed menu items
        },
      });
    } catch (err) {
      console.error('Failed to fetch restaurant details:', err);
      // Fallback - navigate with just the basic info if details fail to load
      router.push({
        pathname: `/customer/restaurants/[id]`,
        params: {
          id: JSON.stringify(item.id),
          restaurant: JSON.stringify(item)
        },
      });
    }
  };

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
            onPress={() => handleRestaurantPress(item)}
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
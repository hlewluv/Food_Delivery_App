import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, ScrollView } from 'react-native';
import DiscountCard from '../RestaurantCard/DiscountCard';
import { getRestaurants } from '@/apis/restaurants/DiscountList';
import { getRestaurantDetail } from '@/apis/restaurants/RestaurantDetail';
import { RestaurantItem, RestaurantDetailItem } from '@/apis/restaurants/types';
import { router } from 'expo-router';

interface DiscountListProps {
  likedRestaurants: Record<string, boolean>;
  toggleLike: (id: string) => void;
}

const DiscountList = ({ likedRestaurants, toggleLike }: DiscountListProps) => {
  const [data, setData] = useState<RestaurantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const restaurants = await getRestaurants();
      setData(restaurants);
    } catch (err) {
      setError('Failed to fetch restaurants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantPress = async (item: RestaurantItem) => {
    try {
      // Fetch restaurant details before navigation
      const restaurantDetails = await getRestaurantDetail(item.id);
      console.log(restaurantDetails)

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
        pathname: `../restaurant/${item.id}`,
        params: {
          restaurant: JSON.stringify(item)
        },
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="mt-4 px-4">
        <Text className="font-bold text-lg mb-2">Ưu đãi hôm nay</Text>
        <Text>Loading restaurants...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="mt-4 px-4">
        <Text className="font-bold text-lg mb-2">Ưu đãi hôm nay</Text>
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="mt-4">
      <Text className="font-bold text-lg mb-2 px-4">Ưu đãi hôm nay</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
        {data.map((item: RestaurantItem) => (
          <DiscountCard
            key={item.id}
            item={item}
            isLiked={likedRestaurants[item.id] || false}
            onToggleLike={() => toggleLike(item.id)}
            onPress={() => handleRestaurantPress(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default DiscountList;
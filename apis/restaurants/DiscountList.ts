// apis/restaurantList.ts
import apiClient from '../config/apiClient';
import { RestaurantApiResponse , RestaurantItem } from './types';

export const getRestaurants = async (): Promise<RestaurantItem[]> => {
  const response = await apiClient.post<RestaurantApiResponse[]>('/restaurant_list/');

  return response.data
    .filter(item => Array.isArray(item.vouchers) && item.vouchers.length > 0) // 👈 kiểm tra kỹ hơn
    .map(item => {
      const discount = item.vouchers ? Math.max(...item.vouchers) : undefined;

      return {
        id: item.id,
        name: item.restaurant_name,
        image: item.image,
        discount,
        rating: item.average_rating,
        time: '30 min',
      };
    });
};

// apis/restaurantList.ts
import apiClient from '../config/apiClient';
import { RestaurantApiResponse , RestaurantItem } from './types';

export const getRestaurants = async (): Promise<RestaurantItem[]> => {
  const response = await apiClient.post<RestaurantApiResponse[]>('/restaurant_list/');
  
  return response.data
    .filter(item => item.vouchers && item.vouchers.length > 0) // 👈 Chỉ lấy items có voucher
    .map(item => ({
      id: item.id,
      name: item.restaurant_name,
      image: item.image,
      discount: Math.max(...item.vouchers), // Lấy giá trị lớn nhất
      rating: item.average_rating,
      time: '30 min'
    }));
};
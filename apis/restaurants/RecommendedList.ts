import apiClient from '../config/apiClient';
import { RestaurantApiResponse, RestaurantRecommend } from './types';

export const getRestaurants = async (categoryId?: string): Promise<RestaurantRecommend[]> => {
  const response = await apiClient.post<RestaurantApiResponse[]>('/restaurant_list/', {
    ...(categoryId && { category: categoryId })
  });
  
  return response.data
  .filter(item => item.type_restaurant !== null)
  .map(item => ({
    id: item.id,
    name: item.restaurant_name,
    image: item.image,
    rating: item.average_rating,
    category: item.type_restaurant ,
    time: '30 min'
  }));
};
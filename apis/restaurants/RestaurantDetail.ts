import apiClient from '../config/apiClient';
import { RestaurantDetailApiReponse, RestaurantDetailItem } from './types';

export const getRestaurantDetail = async (restaurantId: string): Promise<RestaurantDetailItem[]> => {
  const response = await apiClient.post<RestaurantDetailApiReponse[]>(
    '/menulist/',
    { restaurant: restaurantId }  // 👈 Gửi đúng body với key "restaurant"
  );

  return response.data.map(item => ({
    id: item.id,
    price: item.price,
    food_type: item.food_type,
    food_name: item.food_name,
    image: item.image,
    time: item.time ?? '',
    option_menu: item.option_menu?.map(option => ({
      id: option.id,
      option_name: option.option_name,
      price: option.price
    })) ?? [],
    description: item.description ?? ''
  }));
};

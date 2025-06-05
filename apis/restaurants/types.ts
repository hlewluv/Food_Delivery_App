import { Double } from "react-native/Libraries/Types/CodegenTypes";

export interface RestaurantApiResponse {
  id: string;
  restaurant_name: string;
  phone_restaurant: string;
  address_restaurant: string;
  image: string;
  user: string;
  vouchers?: number[],
  average_rating?: number,
  type_restaurant?: string
}

export interface RestaurantItem {
  id: string;
  name: string;
  image: string;
  discount?: number;
  rating?: number;
  time: string;
}

export interface RestaurantRecommend {
  id: string;
  name: string;
  image: string;
  category?: string;
  rating?: number;
  time: string;
}

export interface RestaurantDetailApiReponse {
  id: string,
  restaurant: string,
  price: number,
  food_type: string,
  food_name: string,
  image: string,
  time: string,
  option_menu?: [
    {
      id: string,
      option_name: string
      price?: string
    },
  ],
  description?: string
}


export interface RestaurantDetailItem{
  id: string,
  price: number,
  food_type: string,
  food_name: string,
  image: string,
  time: string,
  option_menu?: { id: string; option_name: string; price?: string }[],
  description?: string
}
import { categoriesApiResponse, categoriesItem } from "./types";
import apiClient from '../config/apiClient';

export const getCategories = async (): Promise<categoriesItem[]> => {
  const response = await apiClient.get<categoriesApiResponse[]>('/list_typefood/');
  
  return response.data.map(item => ({
      id: item.id,
      category: item.type_name,
      image: item.image
    }));
};
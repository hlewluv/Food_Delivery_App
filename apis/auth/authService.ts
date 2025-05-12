import apiClient from '../config/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginPayload, AuthResponse } from './types';

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/login/', payload);
    
    // Lưu tokens vào AsyncStorage
    await AsyncStorage.multiSet([
      ['refreshToken', response.data.refreshToken],
      ['accessToken', response.data.accessToken]
    ]);
    
    return response.data;
  } catch (error) {
    // Xử lý lỗi và ném ra ngoài component
    throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin');
  }
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
};
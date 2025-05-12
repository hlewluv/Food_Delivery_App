import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../config/apiClient';

export const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await apiClient.post('/refresh-token/', {}, {
      headers: {
        'Cookie': `refreshToken=${refreshToken}`
      }
    });
    const { token } = response.data;

    await AsyncStorage.setItem('accessToken', token);
    return token;
  } catch (error) {
    console.error('Refresh token failed:', error);
    return null;
  }
};
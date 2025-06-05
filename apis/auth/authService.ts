import apiClient from '../config/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginPayload, SignupPayload, AuthResponse } from './types';

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/login/', payload);
    
    // Lưu tokens vào AsyncStorage
    await AsyncStorage.multiSet([
      ['refreshToken', response.data.refreshToken],
      ['accessToken', response.data.accessToken],
      ['id', response.data.id],
      ['role', response.data.role]
    ]);
    
    return response.data;
  } catch (error) {
    // Xử lý lỗi và ném ra ngoài component
    throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin');
  }
};

export const signup = async (payload: SignupPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/register/', payload);
    
    // Lưu tokens vào AsyncStorage nếu API trả về
    if (response.data.accessToken && response.data.refreshToken) {
      await AsyncStorage.multiSet([
      ['refreshToken', response.data.refreshToken],
      ['accessToken', response.data.accessToken],
      ['id', response.data.id],
      ['role', response.data.role]
    ]);
    }
    
    return response.data;
  } catch (error: any) {
    // Xử lý lỗi và ném ra ngoài component
    throw new Error(
      error.response?.data?.message || 
      'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin'
    );
  }
};

// export const sendOTP = async (email: string): Promise<OTPResponse> => {
//   try {
//     const response = await apiClient.post<OTPResponse>('/otp/send/', { email });
//     return response.data;
//   } catch (error: any) {
//     throw new Error(
//       error.response?.data?.message || 
//       'Không thể gửi mã OTP. Vui lòng thử lại'
//     );
//   }
// };

// export const verifyOTP = async (email: string, otp: string): Promise<void> => {
//   try {
//     await apiClient.post('/otp/verify/', { email, otp });
//   } catch (error: any) {
//     throw new Error(
//       error.response?.data?.message || 
//       'Xác thực OTP thất bại. Mã OTP không đúng hoặc đã hết hạn'
//     );
//   }
// };

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    // Xóa tokens bất kể API logout thành công hay thất bại
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('id');
  }
};
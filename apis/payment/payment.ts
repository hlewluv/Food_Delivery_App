import apiClient from '../config/apiClient';
import { invoice, invoiceReponse } from './types';

export const payment = async (payload: invoice): Promise<invoiceReponse> => {
  try {
    const response = await apiClient.post<invoiceReponse>('/zalopay/create-order/', payload);
    
    return response.data;
  } catch (error) {
    // Xử lý lỗi và ném ra ngoài component
    throw new Error('Thanh toán thất bại');
  }
};
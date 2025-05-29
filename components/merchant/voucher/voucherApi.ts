import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.example.com/vouchers'; // Replace with actual API URL

const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const getVouchers = async () => {
  const token = await getAuthToken();
  if (!token) throw new Error('No auth token found');

  const response = await fetch(`${BASE_URL}/my-vouchers`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch vouchers');
  }

  return response.json();
};

export const createVoucher = async (voucher: {
  name: string;
  discount: number;
  minOrder: number;
  expiryDate: string;
  image: string | null;
  status: 'pending' | 'approved' | 'rejected';
}) => {
  const token = await getAuthToken();
  if (!token) throw new Error('No auth token found');

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...voucher, status: 'pending' }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create voucher');
  }

  return response.json().then(res => res.voucher);
};

export const updateVoucher = async (id: string, voucher: {
  name: string;
  discount: number;
  minOrder: number;
  expiryDate: string;
  image: string | null;
  status: 'pending' | 'approved' | 'rejected';
}) => {
  const token = await getAuthToken();
  if (!token) throw new Error('No auth token found');

  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...voucher, status: 'pending' }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update voucher');
  }

  return response.json().then(res => res.voucher);
};

export const deleteVoucher = async (id: string) => {
  const token = await getAuthToken();
  if (!token) throw new Error('No auth token found');

  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete voucher');
  }

  return response.json();
};
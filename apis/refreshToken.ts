import axios from 'axios'

const API_BASE_URL = 'http://172.20.10.2:8000'

export const refreshToken = async (token: String) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/refresh-token/`, {
        
    })

    return response.data // giả sử server trả user info
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Đăng nhập thất bại')
  }
}
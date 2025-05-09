import axios from 'axios'

const API_BASE_URL = 'http://172.20.10.2:8000'

export const mockLogin = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login/`, {
      username: username,
      password: password
    })

    return response.data // giả sử server trả user info
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Đăng nhập thất bại')
  }
}

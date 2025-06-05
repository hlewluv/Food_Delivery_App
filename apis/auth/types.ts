export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
    accessToken: string;  // Changed from access_token to match backend
    refreshToken: string; // Optional refresh token
    email?: string;
    username?: string;
    password?: string;
    id: string;
    role: string; 
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  id: string,
  role: string; 
}
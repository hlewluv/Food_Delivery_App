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
    [key: string]: any; // Allow for additional properties
}
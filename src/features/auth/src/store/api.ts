/**
 * Auth Feature API
 */

import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import type { LoginData, RegisterData, AuthResponse, User } from './states';

export const authApi = {
  // Register new user
  register: (data: RegisterData) =>
    axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data),

  // Login user
  login: (data: LoginData) =>
    axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data),

  // Get current user profile
  getProfile: () =>
    axiosInstance.get<User>(API_ENDPOINTS.AUTH.GET_USER),

  // Logout (client-side only, no API call needed)
  logout: () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('persist:root');
  },
};

export default authApi;


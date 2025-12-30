/**
 * Users Feature API
 */

import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import type { User } from './states';

export const usersApi = {
  // Get all users
  getUsers: () =>
    axiosInstance.get<User[]>(API_ENDPOINTS.USERS.GET_ALL),

  // Get user by ID
  getUserById: (id: string) =>
    axiosInstance.get<User>(API_ENDPOINTS.USERS.GET_BY_ID(id)),
};

export default usersApi;









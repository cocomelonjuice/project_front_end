import { axiosInstance } from '../../../shared/api/src';
import { API_ENDPOINTS } from '../../../shared/constants/src';

/**
 * Common API functions
 * Similar to vaccine-rsa-web-v2 pattern
 */

const commonApi = {
  getUser: (data: { id: string }) =>
    axiosInstance.get(`${API_ENDPOINTS.AUTH.GET_USER}/${data.id}`),
  
  getRole: () =>
    axiosInstance.get(API_ENDPOINTS.AUTH.GET_ROLE),
  
  getPermissions: () =>
    axiosInstance.get(API_ENDPOINTS.AUTH.GET_PERMISSIONS),
  
  getFunctions: () =>
    axiosInstance.get(API_ENDPOINTS.AUTH.GET_FUNCTIONS),
};

export default commonApi;



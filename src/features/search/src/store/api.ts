import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import { transformSearchResult, type BackendSearchResult } from './apiTransformers';
import type { SearchResult } from './states';

export const searchApi = {
  search: (query: string, type?: string, limit?: number): Promise<SearchResult> => {
    const url = API_ENDPOINTS.SEARCH.SEARCH(query, type, limit);
    return axiosInstance.get<BackendSearchResult>(url).then((response) => ({
      ...response,
      data: transformSearchResult(response.data),
    })).then((response) => response.data);
  },
};

export default searchApi;





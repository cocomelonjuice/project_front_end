import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import { transformSearchResult, type BackendSearchResult } from './apiTransformers';
import type { SearchResult } from './states';

export interface SearchFilters {
  projectKeys?: string[];
  projectTypes?: string[];
  issueStatusIds?: string[];
  issuePriorityIds?: string[];
  assigneeIds?: string[];
  issueKeys?: string[];
}

export const searchApi = {
  search: (
    query: string,
    type?: string,
    limit?: number,
    filters?: SearchFilters,
  ): Promise<SearchResult> => {
    const url = API_ENDPOINTS.SEARCH.SEARCH(query, type, limit, filters);
    return axiosInstance.get<BackendSearchResult>(url).then((response) => ({
      ...response,
      data: transformSearchResult(response.data),
    })).then((response) => response.data);
  },
};

export default searchApi;





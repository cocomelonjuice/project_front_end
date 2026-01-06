/**
 * Comments Feature API
 */

import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import { transformComment, transformComments } from './apiTransformers';
import type { Comment, CreateCommentData, UpdateCommentData } from './states';

export const commentsApi = {
  // Create comment for an issue
  createComment: (issueId: string, data: { content: string }) =>
    axiosInstance.post<BackendComment>(API_ENDPOINTS.COMMENTS.CREATE(issueId), data).then((response) => ({
      ...response,
      data: transformComment(response.data),
    })),

  // Get all comments for an issue
  getCommentsByIssue: (issueId: string) =>
    axiosInstance.get<BackendComment[]>(API_ENDPOINTS.COMMENTS.GET_BY_ISSUE(issueId)).then((response) => ({
      ...response,
      data: transformComments(response.data || []),
    })),

  // Get comment by ID
  getCommentById: (id: string) =>
    axiosInstance.get<BackendComment>(API_ENDPOINTS.COMMENTS.GET_BY_ID(id)).then((response) => ({
      ...response,
      data: transformComment(response.data),
    })),

  // Update comment
  updateComment: (id: string, data: UpdateCommentData) =>
    axiosInstance.put<BackendComment>(API_ENDPOINTS.COMMENTS.UPDATE(id), data).then((response) => ({
      ...response,
      data: transformComment(response.data),
    })),

  // Delete comment
  deleteComment: (id: string) =>
    axiosInstance.delete<void>(API_ENDPOINTS.COMMENTS.DELETE(id)),
};

export default commentsApi;


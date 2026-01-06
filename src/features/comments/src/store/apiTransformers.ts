/**
 * API Transformers for Comments
 * Transforms backend API responses to frontend format
 */

import type { Comment } from './states';

// Backend Comment response structure
interface BackendComment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    email: string;
    displayName: string;
  };
  issue: {
    id: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Transform backend comment to frontend comment
 */
export const transformComment = (backendComment: BackendComment): Comment => {
  return {
    id: backendComment.id,
    content: backendComment.content,
    authorId: backendComment.author.id,
    author: {
      id: backendComment.author.id,
      username: backendComment.author.username,
      email: backendComment.author.email,
      displayName: backendComment.author.displayName,
    },
    issueId: backendComment.issue.id,
    createdAt: backendComment.createdAt,
    updatedAt: backendComment.updatedAt,
  };
};

/**
 * Transform array of backend comments to frontend comments
 */
export const transformComments = (backendComments: BackendComment[]): Comment[] => {
  return backendComments.map(transformComment);
};





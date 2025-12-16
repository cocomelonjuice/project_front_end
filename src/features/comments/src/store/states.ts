/**
 * Comments Feature State
 */

import type { User } from '../../issues/src/store/states';

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  issueId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
  authorId: string;
  issueId: string;
}

export interface UpdateCommentData {
  content: string;
}

// Initial state
const initialState = {
  comments: [] as Comment[],
  currentComment: null as Comment | null,
  getCommentsLoading: false,
  getCommentByIdLoading: false,
  createCommentLoading: false,
  updateCommentLoading: false,
  deleteCommentLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type CommentsState = typeof initialState;
export default initialState;




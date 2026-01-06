import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import initialState, { type CommentsState } from './states';

export const MODULE_NAME = 'comments';
export const useSelectorComments = getHookModuleSelector<CommentsState>(MODULE_NAME);

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // #region - getCommentsByIssue
    getCommentsByIssueRequest(state, _action: any) {
      state.getCommentsLoading = true;
      state.errors = null;
    },
    getCommentsByIssueSuccess(state, { payload }: any) {
      state.getCommentsLoading = false;
      state.comments = payload.data || [];
    },
    getCommentsByIssueFailure(state, { type, payload }: any) {
      state.getCommentsLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getCommentsByIssue

    // #region - getCommentById
    getCommentByIdRequest(state, _action: any) {
      state.getCommentByIdLoading = true;
      state.currentComment = null;
      state.errors = null;
    },
    getCommentByIdSuccess(state, { payload }: any) {
      state.getCommentByIdLoading = false;
      state.currentComment = payload.data;
    },
    getCommentByIdFailure(state, { type, payload }: any) {
      state.getCommentByIdLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getCommentById

    // #region - createComment
    createCommentRequest(state, _action: any) {
      state.createCommentLoading = true;
      state.errors = null;
    },
    createCommentSuccess(state, { payload }: any) {
      state.createCommentLoading = false;
      if (payload.data) {
        state.comments = [...state.comments, payload.data];
      }
    },
    createCommentFailure(state, { type, payload }: any) {
      state.createCommentLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - createComment

    // #region - updateComment
    updateCommentRequest(state, _action: any) {
      state.updateCommentLoading = true;
      state.errors = null;
    },
    updateCommentSuccess(state, { payload }: any) {
      state.updateCommentLoading = false;
      if (payload.data) {
        state.comments = state.comments.map((comment) =>
          comment.id === payload.data.id ? payload.data : comment
        );
        if (state.currentComment?.id === payload.data.id) {
          state.currentComment = payload.data;
        }
      }
    },
    updateCommentFailure(state, { type, payload }: any) {
      state.updateCommentLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - updateComment

    // #region - deleteComment
    deleteCommentRequest(state, _action: any) {
      state.deleteCommentLoading = true;
      state.errors = null;
    },
    deleteCommentSuccess(state, { payload }: any) {
      state.deleteCommentLoading = false;
      if (payload.id) {
        state.comments = state.comments.filter((comment) => comment.id !== payload.id);
        if (state.currentComment?.id === payload.id) {
          state.currentComment = null;
        }
      }
    },
    deleteCommentFailure(state, { type, payload }: any) {
      state.deleteCommentLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - deleteComment

    // #region - clearErrors
    clearErrors(state) {
      state.errors = null;
    },
    // #endregion - clearErrors

    // #region - setCurrentComment
    setCurrentComment(state, { payload }: any) {
      state.currentComment = payload;
    },
    // #endregion - setCurrentComment
  },
});

export { actions, reducer };





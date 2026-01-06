import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import initialState, { type AttachmentsState } from './states';

export const MODULE_NAME = 'attachments';
export const useSelectorAttachments = getHookModuleSelector<AttachmentsState>(MODULE_NAME);

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // #region - getAttachmentsByIssue
    getAttachmentsByIssueRequest(state, _action: any) {
      state.getAttachmentsLoading = true;
      state.errors = null;
    },
    getAttachmentsByIssueSuccess(state, { payload }: any) {
      state.getAttachmentsLoading = false;
      state.attachments = payload.data || [];
    },
    getAttachmentsByIssueFailure(state, { type, payload }: any) {
      state.getAttachmentsLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getAttachmentsByIssue

    // #region - getAttachmentById
    getAttachmentByIdRequest(state, _action: any) {
      state.getAttachmentByIdLoading = true;
      state.currentAttachment = null;
      state.errors = null;
    },
    getAttachmentByIdSuccess(state, { payload }: any) {
      state.getAttachmentByIdLoading = false;
      state.currentAttachment = payload.data;
    },
    getAttachmentByIdFailure(state, { type, payload }: any) {
      state.getAttachmentByIdLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getAttachmentById

    // #region - uploadAttachment
    uploadAttachmentRequest(state, _action: any) {
      state.uploadAttachmentLoading = true;
      state.errors = null;
    },
    uploadAttachmentSuccess(state, { payload }: any) {
      state.uploadAttachmentLoading = false;
      if (payload.data) {
        state.attachments = [...state.attachments, payload.data];
      }
    },
    uploadAttachmentFailure(state, { type, payload }: any) {
      state.uploadAttachmentLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - uploadAttachment

    // #region - deleteAttachment
    deleteAttachmentRequest(state, _action: any) {
      state.deleteAttachmentLoading = true;
      state.errors = null;
    },
    deleteAttachmentSuccess(state, { payload }: any) {
      state.deleteAttachmentLoading = false;
      if (payload.id) {
        state.attachments = state.attachments.filter((attachment) => attachment.id !== payload.id);
        if (state.currentAttachment?.id === payload.id) {
          state.currentAttachment = null;
        }
      }
    },
    deleteAttachmentFailure(state, { type, payload }: any) {
      state.deleteAttachmentLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - deleteAttachment

    // #region - clearErrors
    clearErrors(state) {
      state.errors = null;
    },
    // #endregion - clearErrors

    // #region - setCurrentAttachment
    setCurrentAttachment(state, { payload }: any) {
      state.currentAttachment = payload;
    },
    // #endregion - setCurrentAttachment
  },
});

export { actions, reducer };





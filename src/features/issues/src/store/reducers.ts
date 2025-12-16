import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import initialState, { type IssuesState } from './states';

export const MODULE_NAME = 'issues';
export const useSelectorIssues = getHookModuleSelector<IssuesState>(MODULE_NAME);

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // #region - getIssues
    getIssuesRequest(state, _action: any) {
      state.getIssuesLoading = true;
      state.errors = null;
    },
    getIssuesSuccess(state, { payload }: any) {
      state.getIssuesLoading = false;
      state.issues = payload.data || [];
    },
    getIssuesFailure(state, { type, payload }: any) {
      state.getIssuesLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getIssues

    // #region - getIssueById
    getIssueByIdRequest(state, _action: any) {
      state.getIssueByIdLoading = true;
      state.currentIssue = null;
      state.errors = null;
    },
    getIssueByIdSuccess(state, { payload }: any) {
      state.getIssueByIdLoading = false;
      state.currentIssue = payload.data;
    },
    getIssueByIdFailure(state, { type, payload }: any) {
      state.getIssueByIdLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getIssueById

    // #region - createIssue
    createIssueRequest(state, _action: any) {
      state.createIssueLoading = true;
      state.errors = null;
    },
    createIssueSuccess(state, { payload }: any) {
      state.createIssueLoading = false;
      if (payload.data) {
        state.issues = [payload.data, ...state.issues];
      }
    },
    createIssueFailure(state, { type, payload }: any) {
      state.createIssueLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - createIssue

    // #region - updateIssue
    updateIssueRequest(state, _action: any) {
      state.updateIssueLoading = true;
      state.errors = null;
    },
    updateIssueSuccess(state, { payload }: any) {
      state.updateIssueLoading = false;
      if (payload.data) {
        const index = state.issues.findIndex((issue) => issue.id === payload.data.id);
        if (index !== -1) {
          state.issues[index] = payload.data;
        }
        if (state.currentIssue?.id === payload.data.id) {
          state.currentIssue = payload.data;
        }
      }
    },
    updateIssueFailure(state, { type, payload }: any) {
      state.updateIssueLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - updateIssue

    // #region - deleteIssue
    deleteIssueRequest(state, _action: any) {
      state.deleteIssueLoading = true;
      state.errors = null;
    },
    deleteIssueSuccess(state, { payload }: any) {
      state.deleteIssueLoading = false;
      if (payload.id) {
        state.issues = state.issues.filter((issue) => issue.id !== payload.id);
        if (state.currentIssue?.id === payload.id) {
          state.currentIssue = null;
        }
      }
    },
    deleteIssueFailure(state, { type, payload }: any) {
      state.deleteIssueLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - deleteIssue

    // #region - assignIssue
    assignIssueRequest(state, _action: any) {
      state.assignIssueLoading = true;
      state.errors = null;
    },
    assignIssueSuccess(state, { payload }: any) {
      state.assignIssueLoading = false;
      if (payload.data) {
        const index = state.issues.findIndex((issue) => issue.id === payload.data.id);
        if (index !== -1) {
          state.issues[index] = payload.data;
        }
        if (state.currentIssue?.id === payload.data.id) {
          state.currentIssue = payload.data;
        }
      }
    },
    assignIssueFailure(state, { type, payload }: any) {
      state.assignIssueLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - assignIssue

    // #region - transitionIssue
    transitionIssueRequest(state, _action: any) {
      state.transitionIssueLoading = true;
      state.errors = null;
    },
    transitionIssueSuccess(state, { payload }: any) {
      state.transitionIssueLoading = false;
      if (payload.data) {
        const index = state.issues.findIndex((issue) => issue.id === payload.data.id);
        if (index !== -1) {
          state.issues[index] = payload.data;
        }
        if (state.currentIssue?.id === payload.data.id) {
          state.currentIssue = payload.data;
        }
      }
    },
    transitionIssueFailure(state, { type, payload }: any) {
      state.transitionIssueLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - transitionIssue

    // #region - clearErrors
    clearErrors(state) {
      state.errors = null;
    },
    // #endregion - clearErrors

    // #region - resetCreateIssueLoading
    resetCreateIssueLoading(state) {
      state.createIssueLoading = false;
    },
    // #endregion - resetCreateIssueLoading

    // #region - setCurrentIssue
    setCurrentIssue(state, { payload }: any) {
      state.currentIssue = payload;
    },
    // #endregion - setCurrentIssue
  },
});

export { actions, reducer };


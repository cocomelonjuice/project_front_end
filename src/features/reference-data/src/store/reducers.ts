import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import initialState, { type ReferenceDataState } from './states';

export const MODULE_NAME = 'referenceData';
export const useSelectorReferenceData = getHookModuleSelector<ReferenceDataState>(MODULE_NAME);

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // #region - getIssueTypes
    getIssueTypesRequest(state, _action: any) {
      state.getIssueTypesLoading = true;
      state.errors = null;
    },
    getIssueTypesSuccess(state, { payload }: any) {
      state.getIssueTypesLoading = false;
      state.issueTypes = payload.data || [];
    },
    getIssueTypesFailure(state, { type, payload }: any) {
      state.getIssueTypesLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getIssueTypes

    // #region - getPriorities
    getPrioritiesRequest(state, _action: any) {
      state.getPrioritiesLoading = true;
      state.errors = null;
    },
    getPrioritiesSuccess(state, { payload }: any) {
      state.getPrioritiesLoading = false;
      state.priorities = payload.data || [];
    },
    getPrioritiesFailure(state, { type, payload }: any) {
      state.getPrioritiesLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getPriorities

    // #region - getStatuses
    getStatusesRequest(state, _action: any) {
      state.getStatusesLoading = true;
      state.errors = null;
    },
    getStatusesSuccess(state, { payload }: any) {
      state.getStatusesLoading = false;
      state.statuses = payload.data || [];
    },
    getStatusesFailure(state, { type, payload }: any) {
      state.getStatusesLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getStatuses

    // #region - clearErrors
    clearErrors(state) {
      state.errors = null;
    },
    // #endregion - clearErrors
  },
});

export { actions, reducer };








import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import initialState, { type LabelsState } from './states';

export const MODULE_NAME = 'labels';
export const useSelectorLabels = getHookModuleSelector<LabelsState>(MODULE_NAME);

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // #region - getLabels
    getLabelsRequest(state, _action: any) {
      state.getLabelsLoading = true;
      state.errors = null;
    },
    getLabelsSuccess(state, { payload }: any) {
      state.getLabelsLoading = false;
      state.labels = payload.data || [];
    },
    getLabelsFailure(state, { type, payload }: any) {
      state.getLabelsLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getLabels

    // #region - getLabelById
    getLabelByIdRequest(state, _action: any) {
      state.getLabelByIdLoading = true;
      state.currentLabel = null;
      state.errors = null;
    },
    getLabelByIdSuccess(state, { payload }: any) {
      state.getLabelByIdLoading = false;
      state.currentLabel = payload.data;
    },
    getLabelByIdFailure(state, { type, payload }: any) {
      state.getLabelByIdLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getLabelById

    // #region - createLabel
    createLabelRequest(state, _action: any) {
      state.createLabelLoading = true;
      state.errors = null;
    },
    createLabelSuccess(state, { payload }: any) {
      state.createLabelLoading = false;
      if (payload.data) {
        state.labels = [...state.labels, payload.data];
      }
    },
    createLabelFailure(state, { type, payload }: any) {
      state.createLabelLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - createLabel

    // #region - updateLabel
    updateLabelRequest(state, _action: any) {
      state.updateLabelLoading = true;
      state.errors = null;
    },
    updateLabelSuccess(state, { payload }: any) {
      state.updateLabelLoading = false;
      if (payload.data) {
        state.labels = state.labels.map((label) => (label.id === payload.data.id ? payload.data : label));
        if (state.currentLabel?.id === payload.data.id) {
          state.currentLabel = payload.data;
        }
      }
    },
    updateLabelFailure(state, { type, payload }: any) {
      state.updateLabelLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - updateLabel

    // #region - deleteLabel
    deleteLabelRequest(state, _action: any) {
      state.deleteLabelLoading = true;
      state.errors = null;
    },
    deleteLabelSuccess(state, { payload }: any) {
      state.deleteLabelLoading = false;
      if (payload.id) {
        state.labels = state.labels.filter((label) => label.id !== payload.id);
        if (state.currentLabel?.id === payload.id) {
          state.currentLabel = null;
        }
      }
    },
    deleteLabelFailure(state, { type, payload }: any) {
      state.deleteLabelLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - deleteLabel

    // #region - clearErrors
    clearErrors(state) {
      state.errors = null;
    },
    // #endregion - clearErrors

    // #region - setCurrentLabel
    setCurrentLabel(state, { payload }: any) {
      state.currentLabel = payload;
    },
    // #endregion - setCurrentLabel
  },
});

export { actions, reducer };





import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import * as initialState from './states';

// Import AppState type - using relative path
type AppState = {
  [key: string]: any;
};

export type ExampleFeatureState = typeof initialState;

export const MODULE_NAME = 'example-feature';

// Create selector hook for this feature
export const useSelectorExampleFeature: TypedUseSelectorHook<ExampleFeatureState> = (selector) =>
  useSelector((state: AppState) => selector(state[MODULE_NAME] as ExampleFeatureState));

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // #region - getExampleData
    getExampleDataRequest(state, _action: any) {
      state.getExampleDataLoading = true;
      state.getExampleDataResponse = null;
    },
    getExampleDataSuccess(state, { payload }: any) {
      state.getExampleDataLoading = false;
      state.getExampleDataResponse = payload.data;
      state.exampleData = payload.data;
    },
    getExampleDataFailure(state, { type, payload: msg }: any) {
      state.getExampleDataLoading = false;
      state.errors = [...(state.errors || []), { type, msg }];
    },
    // #endregion - getExampleData
  },
});

export { actions, reducer };


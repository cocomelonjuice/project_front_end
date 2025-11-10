import { createSlice } from '@reduxjs/toolkit';
import type { SliceCaseReducers, ValidateSliceCaseReducers } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { AppState } from '../types';
import { initialState } from '../states';
// Import reducer modules here
import { commonReducers } from './common.reducer';

export type RootState = typeof initialState;

export const MODULE_NAME = 'root';

export const useSelectorRoot: TypedUseSelectorHook<RootState> = (selector) =>
  useSelector((state: AppState) => selector(state[MODULE_NAME]));

/**
 * Helper to create module selector hook
 * Similar to vaccine-rsa-web-v2 getHookModuleSelector pattern
 */
export function getHookModuleSelector<T>(moduleName: string): TypedUseSelectorHook<T> {
  return (selector: (state: T) => any) =>
    useSelector((state: AppState) => selector(state[moduleName] as T));
}

/**
 * Helper function to create slice reducers
 * Similar to vaccine-rsa-web-v2 pattern
 */
export function createSliceReducers<State, R extends ValidateSliceCaseReducers<State, SliceCaseReducers<State>>>(
  _initialState: State,
  reducer: R,
): R {
  return reducer;
}

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // Combine all reducers here
    ...commonReducers,
  },
});

export { actions, reducer };


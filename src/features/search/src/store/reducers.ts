import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import { initialState, type SearchState } from './states';

export const MODULE_NAME = 'search';
export const useSelectorSearch = getHookModuleSelector<SearchState>(MODULE_NAME);

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // #region - search
    searchRequest(state, { payload }: any) {
      state.loading = true;
      state.query = payload.query || '';
      state.error = null;
    },
    searchSuccess(state, { payload }: any) {
      state.loading = false;
      state.results = payload.data || null;
      state.error = null;
    },
    searchFailure(state, { type, payload }: any) {
      state.loading = false;
      state.error = payload || 'Search failed';
      state.results = null;
    },
    // #endregion - search

    // #region - clearSearch
    clearSearch(state) {
      state.query = '';
      state.results = null;
      state.error = null;
    },
    // #endregion - clearSearch
  },
});

export { actions, reducer };


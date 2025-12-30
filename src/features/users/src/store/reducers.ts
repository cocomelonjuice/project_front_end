import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import initialState, { type UsersState } from './states';

export const MODULE_NAME = 'users';
export const useSelectorUsers = getHookModuleSelector<UsersState>(MODULE_NAME);

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // #region - getUsers
    getUsersRequest(state, _action: any) {
      state.getUsersLoading = true;
      state.errors = null;
    },
    getUsersSuccess(state, { payload }: any) {
      state.getUsersLoading = false;
      state.users = payload.data || [];
    },
    getUsersFailure(state, { type, payload }: any) {
      state.getUsersLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getUsers

    // #region - getUserById
    getUserByIdRequest(state, _action: any) {
      state.getUserByIdLoading = true;
      state.currentUser = null;
      state.errors = null;
    },
    getUserByIdSuccess(state, { payload }: any) {
      state.getUserByIdLoading = false;
      state.currentUser = payload.data;
    },
    getUserByIdFailure(state, { type, payload }: any) {
      state.getUserByIdLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getUserById

    // #region - clearErrors
    clearErrors(state) {
      state.errors = null;
    },
    // #endregion - clearErrors

    // #region - setCurrentUser
    setCurrentUser(state, { payload }: any) {
      state.currentUser = payload;
    },
    // #endregion - setCurrentUser
  },
});

export { actions, reducer };









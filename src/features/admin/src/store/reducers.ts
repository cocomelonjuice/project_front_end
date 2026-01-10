import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import initialState, { type AdminState } from './states';

export const MODULE_NAME = 'admin';
export const useSelectorAdmin = getHookModuleSelector<AdminState>(MODULE_NAME);

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

    // #region - updateUser
    updateUserRequest(state, _action: any) {
      state.updateUserLoading = true;
      state.errors = null;
    },
    updateUserSuccess(state, { payload }: any) {
      state.updateUserLoading = false;
      if (payload.data) {
        state.users = state.users.map((user) => (user.id === payload.data.id ? payload.data : user));
      }
    },
    updateUserFailure(state, { type, payload }: any) {
      state.updateUserLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - updateUser

    // #region - deleteUser
    deleteUserRequest(state, _action: any) {
      state.deleteUserLoading = true;
      state.errors = null;
    },
    deleteUserSuccess(state, { payload }: any) {
      state.deleteUserLoading = false;
      if (payload.id) {
        state.users = state.users.filter((user) => user.id !== payload.id);
      }
    },
    deleteUserFailure(state, { type, payload }: any) {
      state.deleteUserLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - deleteUser

    // #region - getRoles
    getRolesRequest(state, _action: any) {
      state.getRolesLoading = true;
      state.errors = null;
    },
    getRolesSuccess(state, { payload }: any) {
      state.getRolesLoading = false;
      state.roles = payload.data || [];
    },
    getRolesFailure(state, { type, payload }: any) {
      state.getRolesLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getRoles

    // #region - getSystemSettings
    getSystemSettingsRequest(state, _action: any) {
      state.getSystemSettingsLoading = true;
      state.errors = null;
    },
    getSystemSettingsSuccess(state, { payload }: any) {
      state.getSystemSettingsLoading = false;
      state.systemSettings = payload.data || [];
    },
    getSystemSettingsFailure(state, { type, payload }: any) {
      state.getSystemSettingsLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getSystemSettings

    // #region - clearErrors
    clearErrors(state) {
      state.errors = null;
    },
    // #endregion - clearErrors
  },
});

export { actions, reducer };






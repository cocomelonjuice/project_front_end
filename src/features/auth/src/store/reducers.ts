import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import initialState, { type AuthState } from './states';

export const MODULE_NAME = 'auth';
export const useSelectorAuth = getHookModuleSelector<AuthState>(MODULE_NAME);

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // #region - login
    loginRequest(state, _action: any) {
      state.loginLoading = true;
      state.errors = null;
    },
    loginSuccess(state, { payload }: any) {
      state.loginLoading = false;
      state.user = payload.data.user;
      state.token = payload.data.accessToken;
      state.isAuthenticated = true;
      
      // Extract roles and permissions from user
      const roles = payload.data.user?.roles?.map((role: any) => role.name) || [];
      const permissions = payload.data.user?.roles?.flatMap((role: any) => role.permissions || []) || [];
      const uniquePermissions = [...new Set(permissions)];
      
      state.roles = roles;
      state.permissions = uniquePermissions;
      
      // Store token and user in localStorage
      localStorage.setItem('token', payload.data.accessToken);
      localStorage.setItem('user', JSON.stringify(payload.data.user));
    },
    loginFailure(state, { type, payload }: any) {
      state.loginLoading = false;
      state.getProfileLoading = false; // Clear profile loading on login failure
      state.isAuthenticated = false;
      state.user = null; // Clear user on login failure
      state.token = null; // Clear token on login failure
      state.roles = [];
      state.permissions = [];
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - login

    // #region - register
    registerRequest(state, _action: any) {
      state.registerLoading = true;
      state.errors = null;
    },
    registerSuccess(state, { payload }: any) {
      state.registerLoading = false;
      state.user = payload.data.user;
      state.token = payload.data.accessToken;
      state.isAuthenticated = true;
      
      // Extract roles and permissions from user
      const roles = payload.data.user?.roles?.map((role: any) => role.name) || [];
      const permissions = payload.data.user?.roles?.flatMap((role: any) => role.permissions || []) || [];
      const uniquePermissions = [...new Set(permissions)];
      
      state.roles = roles;
      state.permissions = uniquePermissions;
      
      // Store token and user in localStorage
      localStorage.setItem('token', payload.data.accessToken);
      localStorage.setItem('user', JSON.stringify(payload.data.user));
    },
    registerFailure(state, { type, payload }: any) {
      state.registerLoading = false;
      state.isAuthenticated = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - register

    // #region - getProfile
    getProfileRequest(state, _action: any) {
      state.getProfileLoading = true;
      state.errors = null;
    },
    getProfileSuccess(state, { payload }: any) {
      state.getProfileLoading = false;
      state.user = payload.data;
      state.isAuthenticated = true;
      
      // Extract roles and permissions from user
      const roles = payload.data?.roles?.map((role: any) => role.name) || [];
      const permissions = payload.data?.roles?.flatMap((role: any) => role.permissions || []) || [];
      const uniquePermissions = [...new Set(permissions)];
      
      state.roles = roles;
      state.permissions = uniquePermissions;
    },
    getProfileFailure(state, { type, payload }: any) {
      state.getProfileLoading = false;
      state.isAuthenticated = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getProfile

    // #region - logout
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.roles = [];
      state.permissions = [];
      state.errors = null;
      state.loginLoading = false;
      state.registerLoading = false;
      state.getProfileLoading = false;
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('persist:root');
    },
    // #endregion - logout

    // #region - clearErrors
    clearErrors(state) {
      state.errors = null;
    },
    // #endregion - clearErrors

    // #region - resetLoadingStates
    resetLoadingStates(state) {
      state.loginLoading = false;
      state.registerLoading = false;
      state.getProfileLoading = false;
    },
    // #endregion - resetLoadingStates
  },
});

export { actions };
export default reducer;


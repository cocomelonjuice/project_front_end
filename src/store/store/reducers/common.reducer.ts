import { initialState } from '../states';
import { createSliceReducers } from '.';

/**
 * Common reducers
 * Similar to vaccine-rsa-web-v2 pattern
 * 
 * Pattern: Request -> Success -> Failure
 */
export const commonReducers = createSliceReducers(initialState, {
  // #region - getRole
  getRoleRequest(state, _action) {
    state.getRoleLoading = true;
  },
  getRoleSuccess(state, { payload }: any) {
    state.getRoleLoading = false;
    state.getRoleResponse = payload.data;
    state.role = payload.data;
  },
  getRoleFailure(state, { type, payload: msg }: any) {
    state.getRoleLoading = false;
    state.errors = [...(state.errors || []), { type, msg }];
  },
  // #endregion - getRole

  // #region - getPermissions
  getPermissionsRequest(state, _action) {
    state.getPermissionsLoading = true;
  },
  getPermissionsSuccess(state, { payload }: any) {
    state.getPermissionsLoading = false;
    state.getPermissionsResponse = payload.data;
    state.permissions = payload.data;
  },
  getPermissionsFailure(state, { type, payload: msg }: any) {
    state.getPermissionsLoading = false;
    state.errors = [...(state.errors || []), { type, msg }];
  },
  // #endregion - getPermissions

  // #region - getFunctions
  getFunctionsRequest(state, _action) {
    state.getFunctionsLoading = true;
  },
  getFunctionsSuccess(state, { payload }: any) {
    state.getFunctionsLoading = false;
    state.getFunctionsResponse = payload.data;
    state.functions = payload.data;
  },
  getFunctionsFailure(state, { type, payload: msg }: any) {
    state.getFunctionsLoading = false;
    state.errors = [...(state.errors || []), { type, msg }];
  },
  // #endregion - getFunctions

  // #region - setUser
  setUser(state, { payload }: any) {
    state.user = payload.data;
  },
  // #endregion - setUser

  // Example: Get User
  getUserRequest(state, _action) {
    state.getUserLoading = true;
    state.getUserResponse = null;
  },
  getUserSuccess(state, { payload }: any) {
    state.getUserLoading = false;
    state.getUserResponse = payload.data;
    state.user = payload.data;
  },
  getUserFailure(state, { payload }: any) {
    state.getUserLoading = false;
    state.errors = [...(state.errors || []), { type: 'getUser', msg: payload }];
  },
});



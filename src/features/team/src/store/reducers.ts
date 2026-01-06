import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import initialState, { type TeamState } from './states';

export const MODULE_NAME = 'team';
export const useSelectorTeam = getHookModuleSelector<TeamState>(MODULE_NAME);

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
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

    // #region - getRoleById
    getRoleByIdRequest(state, _action: any) {
      state.getRoleByIdLoading = true;
      state.currentRole = null;
      state.errors = null;
    },
    getRoleByIdSuccess(state, { payload }: any) {
      state.getRoleByIdLoading = false;
      state.currentRole = payload.data;
    },
    getRoleByIdFailure(state, { type, payload }: any) {
      state.getRoleByIdLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getRoleById

    // #region - createRole
    createRoleRequest(state, _action: any) {
      state.createRoleLoading = true;
      state.errors = null;
    },
    createRoleSuccess(state, { payload }: any) {
      state.createRoleLoading = false;
      if (payload.data) {
        state.roles = [...state.roles, payload.data];
      }
    },
    createRoleFailure(state, { type, payload }: any) {
      state.createRoleLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - createRole

    // #region - updateRole
    updateRoleRequest(state, _action: any) {
      state.updateRoleLoading = true;
      state.errors = null;
    },
    updateRoleSuccess(state, { payload }: any) {
      state.updateRoleLoading = false;
      if (payload.data) {
        state.roles = state.roles.map((role) => (role.id === payload.data.id ? payload.data : role));
        if (state.currentRole?.id === payload.data.id) {
          state.currentRole = payload.data;
        }
      }
    },
    updateRoleFailure(state, { type, payload }: any) {
      state.updateRoleLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - updateRole

    // #region - deleteRole
    deleteRoleRequest(state, _action: any) {
      state.deleteRoleLoading = true;
      state.errors = null;
    },
    deleteRoleSuccess(state, { payload }: any) {
      state.deleteRoleLoading = false;
      if (payload.id) {
        state.roles = state.roles.filter((role) => role.id !== payload.id);
        if (state.currentRole?.id === payload.id) {
          state.currentRole = null;
        }
      }
    },
    deleteRoleFailure(state, { type, payload }: any) {
      state.deleteRoleLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - deleteRole

    // #region - assignRoleToUserInProject
    assignRoleToUserInProjectRequest(state, _action: any) {
      state.assignRoleLoading = true;
      state.errors = null;
    },
    assignRoleToUserInProjectSuccess(state, { payload }: any) {
      state.assignRoleLoading = false;
      // Team members will be derived from users and roles, so we don't update here
      // The component will refetch users/roles to rebuild team members
    },
    assignRoleToUserInProjectFailure(state, { type, payload }: any) {
      state.assignRoleLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - assignRoleToUserInProject

    // #region - getTeamMembers
    getTeamMembersRequest(state, _action: any) {
      state.getTeamMembersLoading = true;
      state.errors = null;
    },
    getTeamMembersSuccess(state, { payload }: any) {
      state.getTeamMembersLoading = false;
      state.teamMembers = payload.data || [];
    },
    getTeamMembersFailure(state, { type, payload }: any) {
      state.getTeamMembersLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getTeamMembers

    // #region - removeRoleFromUserInProject
    removeRoleFromUserInProjectRequest(state, _action: any) {
      state.removeRoleLoading = true;
      state.errors = null;
    },
    removeRoleFromUserInProjectSuccess(state, { payload }: any) {
      state.removeRoleLoading = false;
      // Team members will be refetched, so we don't update here
    },
    removeRoleFromUserInProjectFailure(state, { type, payload }: any) {
      state.removeRoleLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - removeRoleFromUserInProject

    // #region - clearErrors
    clearErrors(state) {
      state.errors = null;
    },
    // #endregion - clearErrors

    // #region - setCurrentRole
    setCurrentRole(state, { payload }: any) {
      state.currentRole = payload;
    },
    // #endregion - setCurrentRole
  },
});

export { actions, reducer };


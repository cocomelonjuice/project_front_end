import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import initialState, { type ProjectsState } from './states';

export const MODULE_NAME = 'projects';
export const useSelectorProjects = getHookModuleSelector<ProjectsState>(MODULE_NAME);

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // #region - getProjects
    getProjectsRequest(state, _action: any) {
      state.getProjectsLoading = true;
      state.errors = null;
    },
    getProjectsSuccess(state, { payload }: any) {
      state.getProjectsLoading = false;
      state.projects = payload.data || [];
    },
    getProjectsFailure(state, { type, payload }: any) {
      state.getProjectsLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getProjects

    // #region - getProjectById
    getProjectByIdRequest(state, _action: any) {
      state.getProjectByIdLoading = true;
      state.currentProject = null;
      state.errors = null;
    },
    getProjectByIdSuccess(state, { payload }: any) {
      state.getProjectByIdLoading = false;
      state.currentProject = payload.data;
    },
    getProjectByIdFailure(state, { type, payload }: any) {
      state.getProjectByIdLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getProjectById

    // #region - createProject
    createProjectRequest(state, _action: any) {
      state.createProjectLoading = true;
      state.errors = null;
    },
    createProjectSuccess(state, { payload }: any) {
      state.createProjectLoading = false;
      state.projects = [payload.data, ...state.projects];
    },
    createProjectFailure(state, { type, payload }: any) {
      state.createProjectLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - createProject

    // #region - updateProject
    updateProjectRequest(state, _action: any) {
      state.updateProjectLoading = true;
      state.errors = null;
    },
    updateProjectSuccess(state, { payload }: any) {
      state.updateProjectLoading = false;
      const index = state.projects.findIndex((p) => p.id === payload.data.id);
      if (index !== -1) {
        state.projects[index] = payload.data;
      }
      if (state.currentProject?.id === payload.data.id) {
        state.currentProject = payload.data;
      }
    },
    updateProjectFailure(state, { type, payload }: any) {
      state.updateProjectLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - updateProject

    // #region - deleteProject
    deleteProjectRequest(state, _action: any) {
      state.deleteProjectLoading = true;
      state.errors = null;
    },
    deleteProjectSuccess(state, { payload }: any) {
      state.deleteProjectLoading = false;
      state.projects = state.projects.filter((p) => p.id !== payload.data.id);
      if (state.currentProject?.id === payload.data.id) {
        state.currentProject = null;
      }
    },
    deleteProjectFailure(state, { type, payload }: any) {
      state.deleteProjectLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - deleteProject

    // #region - clearErrors
    clearErrors(state) {
      state.errors = null;
    },
    // #endregion - clearErrors

    // #region - setCurrentProject
    setCurrentProject(state, { payload }: any) {
      state.currentProject = payload;
    },
    // #endregion - setCurrentProject
  },
});

export { actions, reducer };






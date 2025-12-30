import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import initialState, { type SprintsState } from './states';

export const MODULE_NAME = 'sprints';
export const useSelectorSprints = getHookModuleSelector<SprintsState>(MODULE_NAME);

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // #region - getSprintsByBoard
    getSprintsByBoardRequest(state, _action: any) {
      state.getSprintsLoading = true;
      state.errors = null;
    },
    getSprintsByBoardSuccess(state, { payload }: any) {
      state.getSprintsLoading = false;
      state.sprints = payload.data || [];
    },
    getSprintsByBoardFailure(state, { type, payload }: any) {
      state.getSprintsLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getSprintsByBoard

    // #region - getSprintById
    getSprintByIdRequest(state, _action: any) {
      state.getSprintByIdLoading = true;
      state.currentSprint = null;
      state.errors = null;
    },
    getSprintByIdSuccess(state, { payload }: any) {
      state.getSprintByIdLoading = false;
      state.currentSprint = payload.data;
    },
    getSprintByIdFailure(state, { type, payload }: any) {
      state.getSprintByIdLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getSprintById

    // #region - createSprint
    createSprintRequest(state, _action: any) {
      state.createSprintLoading = true;
      state.errors = null;
    },
    createSprintSuccess(state, { payload }: any) {
      state.createSprintLoading = false;
      if (payload.data) {
        state.sprints = [payload.data, ...state.sprints];
      }
    },
    createSprintFailure(state, { type, payload }: any) {
      state.createSprintLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - createSprint

    // #region - updateSprint
    updateSprintRequest(state, _action: any) {
      state.updateSprintLoading = true;
      state.errors = null;
    },
    updateSprintSuccess(state, { payload }: any) {
      state.updateSprintLoading = false;
      if (payload.data) {
        const index = state.sprints.findIndex((sprint) => sprint.id === payload.data.id);
        if (index !== -1) {
          state.sprints[index] = payload.data;
        }
        if (state.currentSprint?.id === payload.data.id) {
          state.currentSprint = payload.data;
        }
      }
    },
    updateSprintFailure(state, { type, payload }: any) {
      state.updateSprintLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - updateSprint

    // #region - deleteSprint
    deleteSprintRequest(state, _action: any) {
      state.deleteSprintLoading = true;
      state.errors = null;
    },
    deleteSprintSuccess(state, { payload }: any) {
      state.deleteSprintLoading = false;
      if (payload.id) {
        state.sprints = state.sprints.filter((sprint) => sprint.id !== payload.id);
        if (state.currentSprint?.id === payload.id) {
          state.currentSprint = null;
        }
      }
    },
    deleteSprintFailure(state, { type, payload }: any) {
      state.deleteSprintLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - deleteSprint

    // #region - startSprint
    startSprintRequest(state, _action: any) {
      state.startSprintLoading = true;
      state.errors = null;
    },
    startSprintSuccess(state, { payload }: any) {
      state.startSprintLoading = false;
      if (payload.data) {
        const index = state.sprints.findIndex((sprint) => sprint.id === payload.data.id);
        if (index !== -1) {
          state.sprints[index] = payload.data;
        }
        if (state.currentSprint?.id === payload.data.id) {
          state.currentSprint = payload.data;
        }
      }
    },
    startSprintFailure(state, { type, payload }: any) {
      state.startSprintLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - startSprint

    // #region - completeSprint
    completeSprintRequest(state, _action: any) {
      state.completeSprintLoading = true;
      state.errors = null;
    },
    completeSprintSuccess(state, { payload }: any) {
      state.completeSprintLoading = false;
      if (payload.data) {
        const index = state.sprints.findIndex((sprint) => sprint.id === payload.data.id);
        if (index !== -1) {
          state.sprints[index] = payload.data;
        }
        if (state.currentSprint?.id === payload.data.id) {
          state.currentSprint = payload.data;
        }
      }
    },
    completeSprintFailure(state, { type, payload }: any) {
      state.completeSprintLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - completeSprint

    // #region - clearErrors
    clearErrors(state) {
      state.errors = null;
    },
    // #endregion - clearErrors

    // #region - setCurrentSprint
    setCurrentSprint(state, { payload }: any) {
      state.currentSprint = payload;
    },
    // #endregion - setCurrentSprint
  },
});

export { actions, reducer };









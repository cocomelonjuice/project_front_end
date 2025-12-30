import { createSlice } from '@reduxjs/toolkit';
import { getHookModuleSelector } from '../../../../store/store/reducers';
import initialState, { type BoardsState } from './states';

export const MODULE_NAME = 'boards';
export const useSelectorBoards = getHookModuleSelector<BoardsState>(MODULE_NAME);

const { actions, reducer } = createSlice({
  name: MODULE_NAME,
  initialState,
  reducers: {
    // #region - getBoardsByProject
    getBoardsByProjectRequest(state, _action: any) {
      state.getBoardsLoading = true;
      state.errors = null;
    },
    getBoardsByProjectSuccess(state, { payload }: any) {
      state.getBoardsLoading = false;
      state.boards = payload.data || [];
    },
    getBoardsByProjectFailure(state, { type, payload }: any) {
      state.getBoardsLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getBoardsByProject

    // #region - getBoardById
    getBoardByIdRequest(state, _action: any) {
      state.getBoardByIdLoading = true;
      state.currentBoard = null;
      state.errors = null;
    },
    getBoardByIdSuccess(state, { payload }: any) {
      state.getBoardByIdLoading = false;
      state.currentBoard = payload.data;
    },
    getBoardByIdFailure(state, { type, payload }: any) {
      state.getBoardByIdLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - getBoardById

    // #region - createBoard
    createBoardRequest(state, _action: any) {
      state.createBoardLoading = true;
      state.errors = null;
    },
    createBoardSuccess(state, { payload }: any) {
      state.createBoardLoading = false;
      state.boards = [payload.data, ...state.boards];
    },
    createBoardFailure(state, { type, payload }: any) {
      state.createBoardLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - createBoard

    // #region - updateBoard
    updateBoardRequest(state, _action: any) {
      state.updateBoardLoading = true;
      state.errors = null;
    },
    updateBoardSuccess(state, { payload }: any) {
      state.updateBoardLoading = false;
      const index = state.boards.findIndex((b) => b.id === payload.data.id);
      if (index !== -1) {
        state.boards[index] = payload.data;
      }
      if (state.currentBoard?.id === payload.data.id) {
        state.currentBoard = payload.data;
      }
    },
    updateBoardFailure(state, { type, payload }: any) {
      state.updateBoardLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - updateBoard

    // #region - deleteBoard
    deleteBoardRequest(state, _action: any) {
      state.deleteBoardLoading = true;
      state.errors = null;
    },
    deleteBoardSuccess(state, { payload }: any) {
      state.deleteBoardLoading = false;
      state.boards = state.boards.filter((b) => b.id !== payload.data.id);
      if (state.currentBoard?.id === payload.data.id) {
        state.currentBoard = null;
      }
    },
    deleteBoardFailure(state, { type, payload }: any) {
      state.deleteBoardLoading = false;
      state.errors = state.errors ? [...state.errors, { type, msg: payload }] : [{ type, msg: payload }];
    },
    // #endregion - deleteBoard

    // #region - clearErrors
    clearErrors(state) {
      state.errors = null;
    },
    // #endregion - clearErrors

    // #region - setCurrentBoard
    setCurrentBoard(state, { payload }: any) {
      state.currentBoard = payload;
    },
    // #endregion - setCurrentBoard
  },
});

export { actions, reducer };





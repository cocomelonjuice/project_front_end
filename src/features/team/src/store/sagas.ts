import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import rolesApi from './api';
import { USE_MOCK_DATA, mockRoles, delay } from './mockData';
import type { Role, CreateRoleData, UpdateRoleData } from './states';

/**
 * Roles/Team Feature Sagas
 */

const sagas = {
  // #region - getRoles
  *getRolesWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        yield put(actions.getRolesSuccess({ data: mockRoles } as any));
        payload.callback?.onSuccess?.(mockRoles);
      } else {
        const response = yield call(rolesApi.getRoles);
        yield put(actions.getRolesSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch roles';
      yield put(actions.getRolesFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getRoles

  // #region - getRoleById
  *getRoleByIdWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(200);
        const role = mockRoles.find((r) => r.id === payload.data.id);
        if (role) {
          yield put(actions.getRoleByIdSuccess({ data: role } as any));
          payload.callback?.onSuccess?.(role);
        } else {
          throw new Error('Role not found');
        }
      } else {
        const response = yield call(rolesApi.getRoleById, payload.data.id);
        yield put(actions.getRoleByIdSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch role';
      yield put(actions.getRoleByIdFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getRoleById

  // #region - createRole
  *createRoleWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        const data: CreateRoleData = payload.data;
        const newRole: Role = {
          id: `role-${Date.now()}`,
          name: data.name,
          description: data.description,
          permissions: data.permissions,
        };
        mockRoles.push(newRole);
        yield put(actions.createRoleSuccess({ data: newRole } as any));
        payload.callback?.onSuccess?.(newRole);
      } else {
        const response = yield call(rolesApi.createRole, payload.data);
        yield put(actions.createRoleSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create role';
      yield put(actions.createRoleFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - createRole

  // #region - updateRole
  *updateRoleWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        const { id, ...updateData }: { id: string } & UpdateRoleData = payload.data;
        const roleIndex = mockRoles.findIndex((r) => r.id === id);
        if (roleIndex === -1) throw new Error('Role not found');

        const updatedRole: Role = {
          ...mockRoles[roleIndex],
          ...updateData,
        };

        mockRoles[roleIndex] = updatedRole;

        yield put(actions.updateRoleSuccess({ data: updatedRole } as any));
        payload.callback?.onSuccess?.(updatedRole);
      } else {
        const { id, ...updateData } = payload.data;
        const response = yield call(rolesApi.updateRole, id, updateData);
        yield put(actions.updateRoleSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update role';
      yield put(actions.updateRoleFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - updateRole

  // #region - deleteRole
  *deleteRoleWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { id } = payload.data;
        const index = mockRoles.findIndex((r) => r.id === id);
        if (index !== -1) {
          mockRoles.splice(index, 1);
        }
        yield put(actions.deleteRoleSuccess({ id } as any));
        payload.callback?.onSuccess?.();
      } else {
        yield call(rolesApi.deleteRole, payload.data.id);
        yield put(actions.deleteRoleSuccess({ id: payload.data.id } as any));
        payload.callback?.onSuccess?.();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete role';
      yield put(actions.deleteRoleFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - deleteRole

  // #region - assignRoleToUserInProject
  *assignRoleToUserInProjectWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        // Mock: Just simulate success
        yield put(actions.assignRoleToUserInProjectSuccess({} as any));
        payload.callback?.onSuccess?.();
      } else {
        yield call(rolesApi.assignRoleToUserInProject, payload.data);
        yield put(actions.assignRoleToUserInProjectSuccess({} as any));
        payload.callback?.onSuccess?.();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to assign role';
      yield put(actions.assignRoleToUserInProjectFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - assignRoleToUserInProject

  // #region - getTeamMembers
  *getTeamMembersWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        yield put(actions.getTeamMembersSuccess({ data: [] } as any));
        payload.callback?.onSuccess?.([]);
      } else {
        const response = yield call(rolesApi.getTeamMembers, payload.data.projectId);
        yield put(actions.getTeamMembersSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch team members';
      yield put(actions.getTeamMembersFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getTeamMembers

  // #region - removeRoleFromUserInProject
  *removeRoleFromUserInProjectWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        yield put(actions.removeRoleFromUserInProjectSuccess({} as any));
        payload.callback?.onSuccess?.();
      } else {
        yield call(rolesApi.removeRoleFromUserInProject, payload.data);
        yield put(actions.removeRoleFromUserInProjectSuccess({} as any));
        payload.callback?.onSuccess?.();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to remove role';
      yield put(actions.removeRoleFromUserInProjectFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - removeRoleFromUserInProject
};

const sagaWatcher = [
  takeLatest(actions.getRolesRequest.type, sagas.getRolesWorker),
  takeLatest(actions.getRoleByIdRequest.type, sagas.getRoleByIdWorker),
  takeLatest(actions.createRoleRequest.type, sagas.createRoleWorker),
  takeLatest(actions.updateRoleRequest.type, sagas.updateRoleWorker),
  takeLatest(actions.deleteRoleRequest.type, sagas.deleteRoleWorker),
  takeLatest(actions.assignRoleToUserInProjectRequest.type, sagas.assignRoleToUserInProjectWorker),
  takeLatest(actions.getTeamMembersRequest.type, sagas.getTeamMembersWorker),
  takeLatest(actions.removeRoleFromUserInProjectRequest.type, sagas.removeRoleFromUserInProjectWorker),
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}


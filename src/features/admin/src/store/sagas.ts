import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import adminApi from './api';
import { USE_MOCK_DATA, mockAdminUsers, mockSystemSettings, delay } from './mockData';
import type { AdminUser, UpdateUserData } from './states';
import referenceDataApi from '../../../reference-data/src/store/api';
import labelsApi from '../../../labels/src/store/api';
import type { IssueType, Priority, Status } from '../../../reference-data/src/store/states';
import type { Label } from '../../../labels/src/store/states';
import type { SystemSetting } from './states';

/**
 * Admin Feature Sagas
 */

const sagas = {
  // #region - getUsers
  *getUsersWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        yield put(actions.getUsersSuccess({ data: mockAdminUsers } as any));
        payload.callback?.onSuccess?.(mockAdminUsers);
      } else {
        const response = yield call(adminApi.getUsers);
        yield put(actions.getUsersSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch users';
      yield put(actions.getUsersFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getUsers

  // #region - updateUser
  *updateUserWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        const { id, ...updateData }: { id: string } & UpdateUserData = payload.data;
        const userIndex = mockAdminUsers.findIndex((u) => u.id === id);
        if (userIndex === -1) throw new Error('User not found');

        const updatedUser: AdminUser = {
          ...mockAdminUsers[userIndex],
          ...updateData,
        };

        mockAdminUsers[userIndex] = updatedUser;

        yield put(actions.updateUserSuccess({ data: updatedUser } as any));
        payload.callback?.onSuccess?.(updatedUser);
      } else {
        const { id, ...updateData } = payload.data;
        const response = yield call(adminApi.updateUser, id, updateData);
        yield put(actions.updateUserSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update user';
      yield put(actions.updateUserFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - updateUser

  // #region - deleteUser
  *deleteUserWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { id } = payload.data;
        const index = mockAdminUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
          mockAdminUsers.splice(index, 1);
        }
        yield put(actions.deleteUserSuccess({ id } as any));
        payload.callback?.onSuccess?.();
      } else {
        yield call(adminApi.deleteUser, payload.data.id);
        yield put(actions.deleteUserSuccess({ id: payload.data.id } as any));
        payload.callback?.onSuccess?.();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete user';
      yield put(actions.deleteUserFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - deleteUser

  // #region - getSystemSettings
  *getSystemSettingsWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        yield put(actions.getSystemSettingsSuccess({ data: mockSystemSettings } as any));
        payload.callback?.onSuccess?.(mockSystemSettings);
      } else {
        // Fetch all system settings from different APIs
        const [issueTypesResponse, prioritiesResponse, statusesResponse, labelsResponse] = yield all([
          call(adminApi.getIssueTypes),
          call(adminApi.getPriorities),
          call(adminApi.getStatuses),
          call(adminApi.getLabels),
        ]);

        const issueTypes: SystemSetting[] = (issueTypesResponse.data || []).map((it: IssueType) => ({
          id: it.id,
          name: it.name,
          description: it.description,
          type: 'issue_type' as const,
        }));

        const priorities: SystemSetting[] = (prioritiesResponse.data || []).map((p: Priority) => ({
          id: p.id,
          name: p.name,
          orderNum: p.orderNum,
          type: 'priority' as const,
        }));

        const statuses: SystemSetting[] = (statusesResponse.data || []).map((s: Status) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          color: s.color,
          type: 'status' as const,
        }));

        const labels: SystemSetting[] = (labelsResponse.data || []).map((l: Label) => ({
          id: l.id,
          name: l.name,
          description: l.description,
          color: l.color,
          type: 'label' as const,
        }));

        const allSettings = [...issueTypes, ...priorities, ...statuses, ...labels];

        yield put(actions.getSystemSettingsSuccess({ data: allSettings } as any));
        payload.callback?.onSuccess?.(allSettings);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch system settings';
      yield put(actions.getSystemSettingsFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getSystemSettings
};

const sagaWatcher = [
  takeLatest(actions.getUsersRequest.type, sagas.getUsersWorker),
  takeLatest(actions.updateUserRequest.type, sagas.updateUserWorker),
  takeLatest(actions.deleteUserRequest.type, sagas.deleteUserWorker),
  takeLatest(actions.getSystemSettingsRequest.type, sagas.getSystemSettingsWorker),
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}


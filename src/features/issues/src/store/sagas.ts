import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import issuesApi from './api';
import { USE_MOCK_DATA, mockIssues, mockUsers, mockIssueTypes, mockPriorities, mockStatuses, delay, getNextIssueKey } from './mockData';
import type { Issue, CreateIssueData, UpdateIssueData } from './states';

/**
 * Issues Feature Sagas
 */

const sagas = {
  // #region - getIssues
  *getIssuesWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { projectId, statusId, assigneeId, priorityId } = payload.data || {};
        let filtered = [...mockIssues].filter((issue) => issue.projectId === projectId);
        
        if (statusId) filtered = filtered.filter((issue) => issue.statusId === statusId);
        if (assigneeId) filtered = filtered.filter((issue) => issue.assigneeId === assigneeId);
        if (priorityId) filtered = filtered.filter((issue) => issue.priorityId === priorityId);

        // Enrich with related data
        const enriched = filtered.map((issue) => ({
          ...issue,
          type: mockIssueTypes.find((t) => t.id === issue.typeId),
          priority: mockPriorities.find((p) => p.id === issue.priorityId),
          status: mockStatuses.find((s) => s.id === issue.statusId),
          assignee: issue.assigneeId ? mockUsers.find((u) => u.id === issue.assigneeId) : undefined,
          reporter: mockUsers.find((u) => u.id === issue.reporterId),
        }));

        yield put(actions.getIssuesSuccess({ data: enriched } as any));
        payload.callback?.onSuccess?.(enriched);
      } else {
        const response = yield call(issuesApi.getIssues, payload.data);
        yield put(actions.getIssuesSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      yield put(actions.getIssuesFailure(error?.response?.data?.message || error.message));
      payload.callback?.onError?.();
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getIssues

  // #region - getIssueById
  *getIssueByIdWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(200);
        const issue = mockIssues.find((i) => i.id === payload.data.id);
        if (issue) {
          const enriched: Issue = {
            ...issue,
            type: mockIssueTypes.find((t) => t.id === issue.typeId),
            priority: mockPriorities.find((p) => p.id === issue.priorityId),
            status: mockStatuses.find((s) => s.id === issue.statusId),
            assignee: issue.assigneeId ? mockUsers.find((u) => u.id === issue.assigneeId) : undefined,
            reporter: mockUsers.find((u) => u.id === issue.reporterId),
          };
          yield put(actions.getIssueByIdSuccess({ data: enriched } as any));
          payload.callback?.onSuccess?.(enriched);
        } else {
          throw new Error('Issue not found');
        }
      } else {
        const response = yield call(issuesApi.getIssueById, payload.data.id);
        yield put(actions.getIssueByIdSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      yield put(actions.getIssueByIdFailure(error?.response?.data?.message || error.message));
      payload.callback?.onError?.();
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getIssueById

  // #region - createIssue
  *createIssueWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        const data: CreateIssueData = payload.data;
        const projectKey = 'PROJ'; // This should come from project data
        const existingIssues = [...mockIssues];
        const newKey = getNextIssueKey(projectKey, existingIssues);
        
        const newIssue: Issue = {
          id: `issue-${Date.now()}`,
          key: newKey,
          summary: data.summary,
          description: data.description,
          typeId: data.typeId,
          type: mockIssueTypes.find((t) => t.id === data.typeId),
          priorityId: data.priorityId,
          priority: mockPriorities.find((p) => p.id === data.priorityId),
          statusId: data.statusId,
          status: mockStatuses.find((s) => s.id === data.statusId),
          assigneeId: data.assigneeId,
          assignee: data.assigneeId ? mockUsers.find((u) => u.id === data.assigneeId) : undefined,
          reporterId: data.reporterId,
          reporter: mockUsers.find((u) => u.id === data.reporterId),
          projectId: data.projectId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        mockIssues.push(newIssue);

        yield put(actions.createIssueSuccess({ data: newIssue } as any));
        payload.callback?.onSuccess?.(newIssue);
      } else {
        // Extract projectId from payload and exclude it from the data object (projectId is in URL, not body)
        const { projectId, ...issueData } = payload.data;
        const response = yield call(issuesApi.createIssue, projectId, issueData);
        yield put(actions.createIssueSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      yield put(actions.createIssueFailure(error?.response?.data?.message || error.message));
      payload.callback?.onError?.();
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - createIssue

  // #region - updateIssue
  *updateIssueWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        const { id, ...updateData }: { id: string } & UpdateIssueData = payload.data;
        const issueIndex = mockIssues.findIndex((i) => i.id === id);
        if (issueIndex === -1) throw new Error('Issue not found');

        const updatedIssue: Issue = {
          ...mockIssues[issueIndex],
          ...updateData,
          updatedAt: new Date().toISOString(),
          type: updateData.typeId ? mockIssueTypes.find((t) => t.id === updateData.typeId) : mockIssues[issueIndex].type,
          priority: updateData.priorityId ? mockPriorities.find((p) => p.id === updateData.priorityId) : mockIssues[issueIndex].priority,
          status: updateData.statusId ? mockStatuses.find((s) => s.id === updateData.statusId) : mockIssues[issueIndex].status,
          assignee: updateData.assigneeId ? mockUsers.find((u) => u.id === updateData.assigneeId) : mockIssues[issueIndex].assignee,
        };

        mockIssues[issueIndex] = updatedIssue;

        yield put(actions.updateIssueSuccess({ data: updatedIssue } as any));
        payload.callback?.onSuccess?.(updatedIssue);
      } else {
        const { id, ...updateData } = payload.data;
        const response = yield call(issuesApi.updateIssue, id, updateData);
        yield put(actions.updateIssueSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      yield put(actions.updateIssueFailure(error?.response?.data?.message || error.message));
      payload.callback?.onError?.();
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - updateIssue

  // #region - deleteIssue
  *deleteIssueWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { id } = payload.data;
        const index = mockIssues.findIndex((i) => i.id === id);
        if (index !== -1) {
          mockIssues.splice(index, 1);
        }
        yield put(actions.deleteIssueSuccess({ id } as any));
        payload.callback?.onSuccess?.();
      } else {
        yield call(issuesApi.deleteIssue, payload.data.id);
        yield put(actions.deleteIssueSuccess({ id: payload.data.id } as any));
        payload.callback?.onSuccess?.();
      }
    } catch (error: any) {
      yield put(actions.deleteIssueFailure(error?.response?.data?.message || error.message));
      payload.callback?.onError?.();
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - deleteIssue

  // #region - assignIssue
  *assignIssueWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { id, assigneeId } = payload.data;
        const issueIndex = mockIssues.findIndex((i) => i.id === id);
        if (issueIndex === -1) throw new Error('Issue not found');

        const updatedIssue: Issue = {
          ...mockIssues[issueIndex],
          assigneeId,
          assignee: assigneeId ? mockUsers.find((u) => u.id === assigneeId) : undefined,
          updatedAt: new Date().toISOString(),
        };

        mockIssues[issueIndex] = updatedIssue;

        yield put(actions.assignIssueSuccess({ data: updatedIssue } as any));
        payload.callback?.onSuccess?.(updatedIssue);
      } else {
        const { id, assigneeId } = payload.data;
        const response = yield call(issuesApi.assignIssue, id, { assigneeId });
        yield put(actions.assignIssueSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      yield put(actions.assignIssueFailure(error?.response?.data?.message || error.message));
      payload.callback?.onError?.();
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - assignIssue

  // #region - transitionIssue
  *transitionIssueWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { id, statusId } = payload.data;
        const issueIndex = mockIssues.findIndex((i) => i.id === id);
        if (issueIndex === -1) throw new Error('Issue not found');

        const updatedIssue: Issue = {
          ...mockIssues[issueIndex],
          statusId,
          status: mockStatuses.find((s) => s.id === statusId),
          updatedAt: new Date().toISOString(),
        };

        mockIssues[issueIndex] = updatedIssue;

        yield put(actions.transitionIssueSuccess({ data: updatedIssue } as any));
        payload.callback?.onSuccess?.(updatedIssue);
      } else {
        const { id, statusId } = payload.data;
        const response = yield call(issuesApi.transitionIssue, id, { statusId });
        yield put(actions.transitionIssueSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      yield put(actions.transitionIssueFailure(error?.response?.data?.message || error.message));
      payload.callback?.onError?.();
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - transitionIssue
};

const sagaWatcher = [
  takeLatest(actions.getIssuesRequest.type, sagas.getIssuesWorker),
  takeLatest(actions.getIssueByIdRequest.type, sagas.getIssueByIdWorker),
  takeLatest(actions.createIssueRequest.type, sagas.createIssueWorker),
  takeLatest(actions.updateIssueRequest.type, sagas.updateIssueWorker),
  takeLatest(actions.deleteIssueRequest.type, sagas.deleteIssueWorker),
  takeLatest(actions.assignIssueRequest.type, sagas.assignIssueWorker),
  takeLatest(actions.transitionIssueRequest.type, sagas.transitionIssueWorker),
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}

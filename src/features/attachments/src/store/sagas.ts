import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import attachmentsApi from './api';
import { USE_MOCK_DATA, mockAttachments, delay, getNextAttachmentId } from './mockData';
import type { Attachment } from './states';

/**
 * Attachments Feature Sagas
 */

const sagas = {
  // #region - getAttachmentsByIssue
  *getAttachmentsByIssueWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { issueId } = payload.data || {};
        const filtered = mockAttachments.filter((attachment) => attachment.issueId === issueId);
        yield put(actions.getAttachmentsByIssueSuccess({ data: filtered } as any));
        payload.callback?.onSuccess?.(filtered);
      } else {
        const response = yield call(attachmentsApi.getAttachmentsByIssue, payload.data.issueId);
        yield put(actions.getAttachmentsByIssueSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch attachments';
      yield put(actions.getAttachmentsByIssueFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getAttachmentsByIssue

  // #region - getAttachmentById
  *getAttachmentByIdWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(200);
        const attachment = mockAttachments.find((a) => a.id === payload.data.id);
        if (attachment) {
          yield put(actions.getAttachmentByIdSuccess({ data: attachment } as any));
          payload.callback?.onSuccess?.(attachment);
        } else {
          throw new Error('Attachment not found');
        }
      } else {
        const response = yield call(attachmentsApi.getAttachmentById, payload.data.id);
        yield put(actions.getAttachmentByIdSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch attachment';
      yield put(actions.getAttachmentByIdFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getAttachmentById

  // #region - uploadAttachment
  *uploadAttachmentWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(1000); // Simulate file upload delay
        const { issueId, file, uploadedById } = payload.data;
        const newAttachment: Attachment = {
          id: getNextAttachmentId(),
          filename: `${Date.now()}-${Math.random().toString(36).substring(7)}${file.name.substring(file.name.lastIndexOf('.'))}`,
          originalFilename: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          filePath: `/uploads/${Date.now()}-${Math.random().toString(36).substring(7)}${file.name.substring(file.name.lastIndexOf('.'))}`,
          issueId: issueId,
          uploadedById: uploadedById,
          createdAt: new Date().toISOString(),
        };
        mockAttachments.push(newAttachment);
        yield put(actions.uploadAttachmentSuccess({ data: newAttachment } as any));
        payload.callback?.onSuccess?.(newAttachment);
      } else {
        const { issueId, file } = payload.data;
        // Backend gets uploadedById from JWT token, so we only send file
        const response = yield call(attachmentsApi.uploadAttachment, issueId, file);
        yield put(actions.uploadAttachmentSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to upload attachment';
      yield put(actions.uploadAttachmentFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - uploadAttachment

  // #region - deleteAttachment
  *deleteAttachmentWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { id } = payload.data;
        const index = mockAttachments.findIndex((a) => a.id === id);
        if (index !== -1) {
          mockAttachments.splice(index, 1);
        }
        yield put(actions.deleteAttachmentSuccess({ id } as any));
        payload.callback?.onSuccess?.();
      } else {
        yield call(attachmentsApi.deleteAttachment, payload.data.id);
        yield put(actions.deleteAttachmentSuccess({ id: payload.data.id } as any));
        payload.callback?.onSuccess?.();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete attachment';
      yield put(actions.deleteAttachmentFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - deleteAttachment
};

const sagaWatcher = [
  takeLatest(actions.getAttachmentsByIssueRequest.type, sagas.getAttachmentsByIssueWorker),
  takeLatest(actions.getAttachmentByIdRequest.type, sagas.getAttachmentByIdWorker),
  takeLatest(actions.uploadAttachmentRequest.type, sagas.uploadAttachmentWorker),
  takeLatest(actions.deleteAttachmentRequest.type, sagas.deleteAttachmentWorker),
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}





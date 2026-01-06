import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import commentsApi from './api';
import { USE_MOCK_DATA, mockComments, delay } from './mockData';
import type { Comment, CreateCommentData, UpdateCommentData } from './states';

/**
 * Comments Feature Sagas
 */

const sagas = {
  // #region - getCommentsByIssue
  *getCommentsByIssueWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { issueId } = payload.data || {};
        const filtered = mockComments.filter((comment) => comment.issueId === issueId);
        yield put(actions.getCommentsByIssueSuccess({ data: filtered } as any));
        payload.callback?.onSuccess?.(filtered);
      } else {
        const response = yield call(commentsApi.getCommentsByIssue, payload.data.issueId);
        yield put(actions.getCommentsByIssueSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch comments';
      yield put(actions.getCommentsByIssueFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getCommentsByIssue

  // #region - getCommentById
  *getCommentByIdWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(200);
        const comment = mockComments.find((c) => c.id === payload.data.id);
        if (comment) {
          yield put(actions.getCommentByIdSuccess({ data: comment } as any));
          payload.callback?.onSuccess?.(comment);
        } else {
          throw new Error('Comment not found');
        }
      } else {
        const response = yield call(commentsApi.getCommentById, payload.data.id);
        yield put(actions.getCommentByIdSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch comment';
      yield put(actions.getCommentByIdFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getCommentById

  // #region - createComment
  *createCommentWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        const data: CreateCommentData = payload.data;
        const newComment: Comment = {
          id: `comment-${Date.now()}`,
          content: data.content,
          authorId: data.authorId,
          author: undefined, // Will be populated from users store
          issueId: data.issueId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockComments.push(newComment);
        yield put(actions.createCommentSuccess({ data: newComment } as any));
        payload.callback?.onSuccess?.(newComment);
      } else {
        const { issueId, authorId, content } = payload.data;
        // Backend gets authorId from JWT token, so we only send content
        const response = yield call(commentsApi.createComment, issueId, { content });
        yield put(actions.createCommentSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create comment';
      yield put(actions.createCommentFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - createComment

  // #region - updateComment
  *updateCommentWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        const { id, ...updateData }: { id: string } & UpdateCommentData = payload.data;
        const commentIndex = mockComments.findIndex((c) => c.id === id);
        if (commentIndex === -1) throw new Error('Comment not found');

        const updatedComment: Comment = {
          ...mockComments[commentIndex],
          ...updateData,
          updatedAt: new Date().toISOString(),
        };

        mockComments[commentIndex] = updatedComment;

        yield put(actions.updateCommentSuccess({ data: updatedComment } as any));
        payload.callback?.onSuccess?.(updatedComment);
      } else {
        const { id, ...updateData } = payload.data;
        const response = yield call(commentsApi.updateComment, id, updateData);
        yield put(actions.updateCommentSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update comment';
      yield put(actions.updateCommentFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - updateComment

  // #region - deleteComment
  *deleteCommentWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { id } = payload.data;
        const index = mockComments.findIndex((c) => c.id === id);
        if (index !== -1) {
          mockComments.splice(index, 1);
        }
        yield put(actions.deleteCommentSuccess({ id } as any));
        payload.callback?.onSuccess?.();
      } else {
        yield call(commentsApi.deleteComment, payload.data.id);
        yield put(actions.deleteCommentSuccess({ id: payload.data.id } as any));
        payload.callback?.onSuccess?.();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete comment';
      yield put(actions.deleteCommentFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - deleteComment
};

const sagaWatcher = [
  takeLatest(actions.getCommentsByIssueRequest.type, sagas.getCommentsByIssueWorker),
  takeLatest(actions.getCommentByIdRequest.type, sagas.getCommentByIdWorker),
  takeLatest(actions.createCommentRequest.type, sagas.createCommentWorker),
  takeLatest(actions.updateCommentRequest.type, sagas.updateCommentWorker),
  takeLatest(actions.deleteCommentRequest.type, sagas.deleteCommentWorker),
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}


import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import authApi from './api';
import type { LoginData, RegisterData } from './states';

/**
 * Auth Feature Sagas
 */

const sagas = {
  // #region - login
  *loginWorker({ payload }: any) {
    try {
      const response = yield call(authApi.login, payload.data);
      
      // Ensure response.data has the expected structure
      if (!response.data || !response.data.user || !response.data.accessToken) {
        throw new Error('Invalid response structure from login API');
      }
      
      yield put(actions.loginSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Login failed';
      yield put(actions.loginFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - login

  // #region - register
  *registerWorker({ payload }: any) {
    try {
      const response = yield call(authApi.register, payload.data);
      yield put(actions.registerSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Registration failed';
      yield put(actions.registerFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - register

  // #region - getProfile
  *getProfileWorker({ payload }: any) {
    try {
      const response = yield call(authApi.getProfile);
      yield put(actions.getProfileSuccess({ data: response.data } as any));
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to get profile';
      yield put(actions.getProfileFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getProfile

  // #region - forgotPassword
  *forgotPasswordWorker({ payload }: any) {
    try {
      const response = yield call(authApi.forgotPassword, payload.data);
      yield put(actions.forgotPasswordSuccess());
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to request password reset';
      yield put(actions.forgotPasswordFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - forgotPassword

  // #region - resetPassword
  *resetPasswordWorker({ payload }: any) {
    try {
      const response = yield call(authApi.resetPassword, payload.data);
      yield put(actions.resetPasswordSuccess());
      payload.callback?.onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to reset password';
      yield put(actions.resetPasswordFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - resetPassword
};

function* authSaga() {
  yield all([
    takeLatest(actions.loginRequest.type, sagas.loginWorker),
    takeLatest(actions.registerRequest.type, sagas.registerWorker),
    takeLatest(actions.getProfileRequest.type, sagas.getProfileWorker),
    takeLatest(actions.forgotPasswordRequest.type, sagas.forgotPasswordWorker),
    takeLatest(actions.resetPasswordRequest.type, sagas.resetPasswordWorker),
  ]);
}

export default authSaga;


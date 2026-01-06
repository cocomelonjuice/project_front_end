import { all, call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './reducers';
import labelsApi from './api';
import { USE_MOCK_DATA, mockLabels, delay, getNextLabelId } from './mockData';
import type { Label, CreateLabelData, UpdateLabelData } from './states';

/**
 * Labels Feature Sagas
 */

const sagas = {
  // #region - getLabels
  *getLabelsWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        yield put(actions.getLabelsSuccess({ data: mockLabels } as any));
        payload.callback?.onSuccess?.(mockLabels);
      } else {
        const response = yield call(labelsApi.getLabels);
        yield put(actions.getLabelsSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch labels';
      yield put(actions.getLabelsFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getLabels

  // #region - getLabelById
  *getLabelByIdWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(200);
        const label = mockLabels.find((l) => l.id === payload.data.id);
        if (label) {
          yield put(actions.getLabelByIdSuccess({ data: label } as any));
          payload.callback?.onSuccess?.(label);
        } else {
          throw new Error('Label not found');
        }
      } else {
        const response = yield call(labelsApi.getLabelById, payload.data.id);
        yield put(actions.getLabelByIdSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch label';
      yield put(actions.getLabelByIdFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - getLabelById

  // #region - createLabel
  *createLabelWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        const data: CreateLabelData = payload.data;
        const newLabel: Label = {
          id: getNextLabelId(),
          name: data.name,
          color: data.color,
          description: data.description,
        };
        mockLabels.push(newLabel);
        yield put(actions.createLabelSuccess({ data: newLabel } as any));
        payload.callback?.onSuccess?.(newLabel);
      } else {
        const response = yield call(labelsApi.createLabel, payload.data);
        yield put(actions.createLabelSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create label';
      yield put(actions.createLabelFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - createLabel

  // #region - updateLabel
  *updateLabelWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(400);
        const { id, ...updateData }: { id: string } & UpdateLabelData = payload.data;
        const labelIndex = mockLabels.findIndex((l) => l.id === id);
        if (labelIndex === -1) throw new Error('Label not found');

        const updatedLabel: Label = {
          ...mockLabels[labelIndex],
          ...updateData,
        };

        mockLabels[labelIndex] = updatedLabel;

        yield put(actions.updateLabelSuccess({ data: updatedLabel } as any));
        payload.callback?.onSuccess?.(updatedLabel);
      } else {
        const { id, ...updateData } = payload.data;
        const response = yield call(labelsApi.updateLabel, id, updateData);
        yield put(actions.updateLabelSuccess({ data: response.data } as any));
        payload.callback?.onSuccess?.(response.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update label';
      yield put(actions.updateLabelFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - updateLabel

  // #region - deleteLabel
  *deleteLabelWorker({ payload }: any) {
    try {
      if (USE_MOCK_DATA) {
        yield delay(300);
        const { id } = payload.data;
        const index = mockLabels.findIndex((l) => l.id === id);
        if (index !== -1) {
          mockLabels.splice(index, 1);
        }
        yield put(actions.deleteLabelSuccess({ id } as any));
        payload.callback?.onSuccess?.();
      } else {
        yield call(labelsApi.deleteLabel, payload.data.id);
        yield put(actions.deleteLabelSuccess({ id: payload.data.id } as any));
        payload.callback?.onSuccess?.();
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete label';
      yield put(actions.deleteLabelFailure(errorMessage));
      payload.callback?.onError?.(error);
    } finally {
      payload.callback?.onFinally?.();
    }
  },
  // #endregion - deleteLabel
};

const sagaWatcher = [
  takeLatest(actions.getLabelsRequest.type, sagas.getLabelsWorker),
  takeLatest(actions.getLabelByIdRequest.type, sagas.getLabelByIdWorker),
  takeLatest(actions.createLabelRequest.type, sagas.createLabelWorker),
  takeLatest(actions.updateLabelRequest.type, sagas.updateLabelWorker),
  takeLatest(actions.deleteLabelRequest.type, sagas.deleteLabelWorker),
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}





import type { ActionCreatorWithOptionalPayload, ActionCreatorWithPreparedPayload, PayloadAction } from '@reduxjs/toolkit';
import type { SagaIterator } from 'redux-saga';
import { takeEvery, takeLatest, takeLeading } from 'redux-saga/effects';
import type { ForkEffect } from 'redux-saga/effects';

type SideEffectType = typeof takeLatest | typeof takeEvery | typeof takeLeading;

type Saga<P = undefined, M = never, E = never> = (action: PayloadAction<P, string, M, E>) => SagaIterator;

interface SagaConfig<P = undefined, M = never, E = never> {
  saga: Saga<P, M, E>;
  sideEffect: SideEffectType;
}

interface AddCaseSagaParams<P, M, E> {
  actionType: string | ActionCreatorWithOptionalPayload<P> | ActionCreatorWithPreparedPayload<any[], P, string, E, M>;
  saga: Saga<P, M, E>;
  sideEffect?: SideEffectType;
}

interface SagaBuilder {
  addCase<P = undefined, M = never, E = never>(params: AddCaseSagaParams<P, M, E>): SagaBuilder;
}

/**
 * Helper function to create sagas with a builder pattern
 * Similar to vaccine-rsa-web-v2 pattern
 * 
 * @example
 * const { rootSaga, watchers } = createSaga((builder) => {
 *   builder
 *     .addCase(fetchDataAction, fetchDataWorker, takeLatest)
 *     .addCase(updateDataAction, updateDataWorker, takeEvery);
 * });
 */
export function createSaga(builderCallback: (builder: SagaBuilder) => void): {
  rootSaga: () => Generator<ForkEffect<never>>;
  watchers: ForkEffect<never>[];
} {
  const sagasMap: Record<string, SagaConfig> = {};

  const builder: SagaBuilder = {
    addCase({ actionType, saga, sideEffect = takeLatest }) {
      sagasMap[actionType.toString()] = { saga: saga as unknown as Saga, sideEffect };
      return builder;
    },
  };

  builderCallback(builder);

  function* rootSaga() {
    for (const [actionType, sagaConfig] of Object.entries(sagasMap)) {
      const { saga, sideEffect } = sagaConfig;
      yield sideEffect(actionType, saga);
    }
  }

  const watchers = Object.entries(sagasMap).map(([actionType, sagaConfig]) => {
    const { saga, sideEffect } = sagaConfig;
    return sideEffect(actionType, saga);
  });

  return { rootSaga, watchers };
}


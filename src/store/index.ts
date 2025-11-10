import { configureStore, combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { reducer, MODULE_NAME } from './store';
import rootSaga from './store/sagas';
import type { InjectStore } from './store/types';

// Import feature stores here (similar to portal pattern)
// Example: import { injectStore as exampleFeatureStore } from '@/features/example-feature/src/store';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Collect all feature stores (similar to portal pattern)
const featureStores: InjectStore[] = [
  // Add feature stores here:
  // exampleFeatureStore,
];

// Build combined reducers (similar to portal pattern)
const combinedReducers = combineReducers({
  [MODULE_NAME]: reducer,
  // Add feature reducers dynamically
  ...featureStores.reduce((acc, fs) => {
    acc[fs.key] = fs.reducer;
    return acc;
  }, {} as Record<string, any>),
});

// Build combined root saga (similar to portal pattern)
function* combinedRootSaga() {
  yield all([
    rootSaga(),
    // Add feature sagas dynamically
    ...featureStores.map((fs) => fs.saga),
  ]);
}

export const store = configureStore({
  reducer: combinedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Disable thunk since we're using saga
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: [],
      },
    }).concat(sagaMiddleware),
});

// Run combined root saga
sagaMiddleware.run(combinedRootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export store module exports
export { rootActions, useSelectorRoot, MODULE_NAME, getHookModuleSelector } from './store';
export type { AppState } from './store/types'; 
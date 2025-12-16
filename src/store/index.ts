import { configureStore, combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { reducer, MODULE_NAME } from './store';
import rootSaga from './store/sagas';
import type { InjectStore } from './store/types';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import feature stores here (similar to portal pattern)
// Example: import { injectStore as exampleFeatureStore } from '@/features/example-feature/src/store';
import { injectStore as issuesInjectStore } from '../features/issues/src/store';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Collect all feature stores (similar to portal pattern)
const featureStores: InjectStore[] = [
  // Add feature stores here:
  issuesInjectStore,
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

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [MODULE_NAME, 'issues'], // Persist root and issues state
};

const persistedReducer = persistReducer(persistConfig, combinedReducers);

// Build combined root saga (similar to portal pattern)
function* combinedRootSaga() {
  yield all([
    rootSaga(),
    // Add feature sagas dynamically
    ...featureStores.map((fs) => fs.saga),
  ]);
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Disable thunk since we're using saga
      serializableCheck: {
        // Ignore redux-persist actions for serializable check
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore callback functions in action payloads (used by sagas)
        ignoredActionPaths: ['payload.callback'],
      },
    }).concat(sagaMiddleware),
});

// Run combined root saga
sagaMiddleware.run(combinedRootSaga);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export store module exports
export { rootActions, useSelectorRoot, MODULE_NAME, getHookModuleSelector } from './store';
export type { AppState } from './store/types'; 
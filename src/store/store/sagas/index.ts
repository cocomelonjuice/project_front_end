import { all } from 'redux-saga/effects';
// Import all saga watchers here
import { commonSagaWatcher } from './common.saga';
// Example: import { anotherSagaWatcher } from './another.saga';

/**
 * Root saga that combines all sagas
 * Similar to vaccine-rsa-web-v2 pattern
 */
const sagaWatcher = [
  ...commonSagaWatcher,
  // Add more watchers here:
  // ...anotherSagaWatcher,
];

export default function* rootSaga() {
  yield all(sagaWatcher);
}



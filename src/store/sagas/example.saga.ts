import { put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';

// Example action types (you'll create these in your slice/reducer)
// For demonstration purposes, we'll use string literals
const EXAMPLE_ACTION = 'example/fetchData';
const EXAMPLE_SUCCESS = 'example/fetchDataSuccess';
const EXAMPLE_FAILURE = 'example/fetchDataFailure';

// Example API call function (replace with your actual API calls)
function* fetchExampleData(action: PayloadAction<{ id: string }>) {
  try {
    // Simulate API call
    // const response = yield call(api.fetchData, action.payload.id);
    
    // For demo, we'll just simulate a delay
    yield new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Dispatch success action
    yield put({
      type: EXAMPLE_SUCCESS,
      payload: { data: { id: action.payload.id, message: 'Data fetched successfully' } },
    });
  } catch (error: any) {
    // Dispatch failure action
    yield put({
      type: EXAMPLE_FAILURE,
      payload: { error: error.message || 'Failed to fetch data' },
    });
  }
}

// Watcher sagas - listen for actions and trigger worker sagas
export function* watchFetchExampleData() {
  // takeLatest: cancels previous saga if new action is dispatched
  yield takeLatest(EXAMPLE_ACTION, fetchExampleData);
  
  // Alternative: takeEvery - runs saga for every action
  // yield takeEvery(EXAMPLE_ACTION, fetchExampleData);
}

// Export all watchers as an array (similar to vaccine-rsa-web-v2 pattern)
export const exampleWatchers = [watchFetchExampleData()];


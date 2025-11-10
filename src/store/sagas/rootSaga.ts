import { all } from 'redux-saga/effects';

// Import all saga watchers here
// Example: import { exampleWatchers } from './example.saga';

/**
 * Root saga that combines all sagas
 * Similar to vaccine-rsa-web-v2 pattern
 * 
 * This is the main saga that combines all feature sagas.
 * Add your saga watchers to the array below.
 */
export default function* rootSaga() {
  yield all([
    // Add all saga watchers here
    // Example: ...exampleWatchers,
    
    // When you create a new saga, import its watchers and add them here:
    // import { myFeatureWatchers } from './myFeature.saga';
    // ...myFeatureWatchers,
  ]);
}


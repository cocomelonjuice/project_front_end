import { reducer, actions, MODULE_NAME } from './reducers';
import saga from './sagas';

/**
 * Feature Store Export
 * Similar to portal feature store pattern
 * 
 * This can be injected into the main store
 */
const injectStore = {
  key: MODULE_NAME,
  reducer,
  saga,
};

export { injectStore, reducer, saga, MODULE_NAME, actions as exampleFeatureActions };



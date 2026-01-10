import { reducer, actions, MODULE_NAME, useSelectorAdmin } from './reducers';
import saga from './sagas';

/**
 * Admin Feature Store Export
 *
 * This can be injected into the main store
 */
const injectStore = {
  key: MODULE_NAME,
  reducer,
  saga,
};

export { injectStore, reducer, saga, MODULE_NAME, actions as adminActions, useSelectorAdmin };






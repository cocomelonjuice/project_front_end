import { reducer, actions, MODULE_NAME, useSelectorSearch } from './reducers';
import saga from './sagas';

const injectStore = {
  key: MODULE_NAME,
  reducer,
  saga,
};

export { injectStore, reducer, saga, MODULE_NAME, actions as searchActions, useSelectorSearch };





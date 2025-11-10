import { reducer, actions, MODULE_NAME, useSelectorRoot, getHookModuleSelector } from './reducers';
import saga from './sagas';

/**
 * Store module export
 * Similar to vaccine-rsa-web-v2 pattern
 * 
 * This can be used for injectable stores if needed
 */
const injectStore = {
  key: MODULE_NAME,
  reducer,
  saga,
};

export { 
  injectStore, 
  reducer, 
  saga, 
  MODULE_NAME, 
  actions as rootActions, 
  useSelectorRoot,
  getHookModuleSelector 
};


/**
 * Notifications Feature Store
 */

import reducer from './reducers';
import saga from './sagas';
import { MODULE_NAME, actions, useSelectorNotifications } from './reducers';
import type { InjectStore } from '../../../../store/store/types';

export const injectStore: InjectStore = {
  key: MODULE_NAME,
  reducer,
  saga,
};

export { MODULE_NAME, actions as notificationsActions, useSelectorNotifications };
export type { NotificationsState } from './states';
export type { Notification } from './states';


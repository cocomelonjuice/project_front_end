/**
 * Auth Feature Store
 */

import reducer from './reducers';
import saga from './sagas';
import { MODULE_NAME, actions, useSelectorAuth } from './reducers';
import type { InjectStore } from '../../../../store/store/types';

export const injectStore: InjectStore = {
  key: MODULE_NAME,
  reducer,
  saga,
};

export { MODULE_NAME, actions as authActions, useSelectorAuth };
export type { AuthState } from './states';
export type {
  User,
  LoginData,
  RegisterData,
  AuthResponse,
  ForgotPasswordData,
  ResetPasswordData,
} from './states';


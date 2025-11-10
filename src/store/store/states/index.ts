// Import all state modules here
import * as commonState from './common.state';

/**
 * Initial state for the Redux store
 * Similar to vaccine-rsa-web-v2 pattern
 */
export const initialState = {
  ...commonState,
  // Add more state modules here
};

export type StateType = typeof initialState;


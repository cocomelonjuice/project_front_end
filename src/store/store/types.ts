/**
 * Type definitions for the store
 * Similar to vaccine-rsa-web-v2 pattern
 */

export type AppState = {
  [key: string]: any;
};

/**
 * Feature store injection interface
 * Similar to portal feature store pattern
 */
export interface InjectStore {
  key: string;
  reducer: any;
  saga: any;
}


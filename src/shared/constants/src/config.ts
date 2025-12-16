/**
 * App Configuration
 */
export const APP_CONFIG = {
  NAME: 'SoftPlace Project Management',
  VERSION: '1.0.0',
  ENV: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
} as const;


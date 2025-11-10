/**
 * Common state definitions
 * Similar to vaccine-rsa-web-v2 pattern
 * 
 * Define your initial state values here
 */

// Example state properties
export const errors: Array<{ type: string; msg: string }> = [];
export const loading: boolean = false;

// Auth state (similar to portal project)
export const user: any = {};
export const role: any[] | null = null;
export const permissions: any[] | null = null;
export const functions: any[] | null = null;

// Auth loading states
export const getRoleLoading: boolean = false;
export const getRoleResponse: any = null;
export const getPermissionsLoading: boolean = false;
export const getPermissionsResponse: any = null;
export const getFunctionsLoading: boolean = false;
export const getFunctionsResponse: any = null;

// Example: User state
export const getUserLoading: boolean = false;
export const getUserResponse: { id?: string; name?: string } | null = null;


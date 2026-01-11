/**
 * Auth Feature State
 */

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  isActive: boolean;
  roles?: Role[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginData {
  identifier: string; // username or email
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  displayName: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Initial state
const initialState = {
  user: null as User | null,
  token: null as string | null,
  isAuthenticated: false,
  roles: [] as string[], // Array of role names (e.g., ['admin', 'user'])
  permissions: [] as string[], // Array of all permissions from all roles
  loginLoading: false,
  registerLoading: false,
  getProfileLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type AuthState = typeof initialState;
export default initialState;










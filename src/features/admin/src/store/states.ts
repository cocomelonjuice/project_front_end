/**
 * Admin Feature State
 */

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  isActive: boolean;
  roles?: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface SystemSetting {
  id: string;
  name: string;
  description?: string;
  orderNum?: number;
  category?: string;
  color?: string;
  type: 'issue_type' | 'priority' | 'status' | 'label';
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  displayName?: string;
  isActive?: boolean;
}

// Initial state
const initialState = {
  users: [] as AdminUser[],
  roles: [] as Role[],
  systemSettings: [] as SystemSetting[],
  getUsersLoading: false,
  updateUserLoading: false,
  deleteUserLoading: false,
  getRolesLoading: false,
  getSystemSettingsLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type AdminState = typeof initialState;
export default initialState;



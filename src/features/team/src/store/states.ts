/**
 * Team Feature State
 */

import type { User } from '../../users/src/store/states';

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
}

export interface ProjectTeamMember {
  userId: string;
  user: User;
  roleId: string;
  role: Role;
}

export interface CreateRoleData {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface AssignRoleData {
  projectId: string;
  roleId: string;
  userId: string;
}

// Initial state
const initialState = {
  roles: [] as Role[],
  currentRole: null as Role | null,
  teamMembers: [] as ProjectTeamMember[],
  getRolesLoading: false,
  getRoleByIdLoading: false,
  createRoleLoading: false,
  updateRoleLoading: false,
  deleteRoleLoading: false,
  getTeamMembersLoading: false,
  assignRoleLoading: false,
  removeRoleLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type TeamState = typeof initialState;
export default initialState;



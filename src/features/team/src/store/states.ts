/**
 * Team Feature State
 */

import type { User } from '../../issues/src/store/states';

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

export interface AssignRoleData {
  projectId: string;
  roleId: string;
  userId: string;
}

// Initial state
const initialState = {
  roles: [] as Role[],
  teamMembers: [] as ProjectTeamMember[],
  getRolesLoading: false,
  getTeamMembersLoading: false,
  assignRoleLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type TeamState = typeof initialState;
export default initialState;



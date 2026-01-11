import type { SearchProject, SearchIssue, SearchUser } from './states';

export interface BackendSearchProject {
  id: string;
  name: string;
  key: string;
  type: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendSearchIssue {
  id: string;
  key: string;
  summary: string;
  description?: string;
  project?: {
    id: string;
    name: string;
    key: string;
  };
  status?: {
    id: string;
    name: string;
    category: string;
    color?: string;
  };
  assignee?: {
    id: string;
    username: string;
    displayName: string;
    email: string;
  };
  type?: {
    id: string;
    name: string;
  };
  priority?: {
    id: string;
    name: string;
    orderNum: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendSearchUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendSearchResult {
  projects: BackendSearchProject[];
  issues: BackendSearchIssue[];
  users: BackendSearchUser[];
  total: number;
}

export const transformProject = (backend: BackendSearchProject): SearchProject => ({
  id: backend.id,
  name: backend.name,
  key: backend.key,
  type: backend.type,
  description: backend.description,
});

export const transformIssue = (backend: BackendSearchIssue): SearchIssue => ({
  id: backend.id,
  key: backend.key,
  summary: backend.summary,
  description: backend.description,
  project: backend.project,
  status: backend.status,
  assignee: backend.assignee,
});

export const transformUser = (backend: BackendSearchUser): SearchUser => ({
  id: backend.id,
  username: backend.username,
  displayName: backend.displayName,
  email: backend.email,
});

export const transformSearchResult = (backend: BackendSearchResult) => ({
  projects: backend.projects.map(transformProject),
  issues: backend.issues.map(transformIssue),
  users: backend.users.map(transformUser),
  total: backend.total,
});


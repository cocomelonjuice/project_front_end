export interface SearchProject {
  id: string;
  name: string;
  key: string;
  type: string;
  description?: string;
}

export interface SearchIssue {
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
    displayName: string;
    username?: string;
    email?: string;
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
}

export interface SearchUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
}

export interface SearchResult {
  projects: SearchProject[];
  issues: SearchIssue[];
  users: SearchUser[];
  total: number;
}

export interface SearchState {
  query: string;
  results: SearchResult | null;
  loading: boolean;
  error: string | null;
}

export const initialState: SearchState = {
  query: '',
  results: null,
  loading: false,
  error: null,
};


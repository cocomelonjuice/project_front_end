/**
 * Issues Feature State
 */

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
}

export interface IssueType {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface Priority {
  id: string;
  name: string;
  color?: string;
  level?: number;
}

export interface Status {
  id: string;
  name: string;
  color?: string;
  category?: 'todo' | 'inprogress' | 'done';
}

export interface Issue {
  id: string;
  key: string; // e.g., "PROJ-1"
  summary: string;
  description?: string;
  typeId: string;
  type?: IssueType;
  priorityId: string;
  priority?: Priority;
  statusId: string;
  status?: Status;
  assigneeId?: string;
  assignee?: User;
  reporterId: string;
  reporter?: User;
  projectId: string;
  sprintId?: string; // Sprint the issue belongs to (optional - unassigned issues are backlog)
  labelIds?: string[]; // Array of label IDs
  labels?: Array<{ id: string; name: string; color?: string; description?: string }>; // Full label objects
  createdAt: string;
  updatedAt: string;
}

export interface CreateIssueData {
  summary: string;
  description?: string;
  typeId: string;
  priorityId: string;
  statusId: string;
  assigneeId?: string;
  sprintId?: string;
  reporterId: string;
  projectId: string;
}

export interface UpdateIssueData {
  summary?: string;
  description?: string;
  typeId?: string;
  priorityId?: string;
  statusId?: string;
  assigneeId?: string;
  sprintId?: string;
}

export interface AssignIssueData {
  assigneeId?: string | null;
}

export interface TransitionIssueData {
  statusId: string;
}

// Initial state
const initialState = {
  issues: [] as Issue[],
  currentIssue: null as Issue | null,
  getIssuesLoading: false,
  getIssueByIdLoading: false,
  createIssueLoading: false,
  updateIssueLoading: false,
  deleteIssueLoading: false,
  assignIssueLoading: false,
  transitionIssueLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type IssuesState = typeof initialState;
export default initialState;

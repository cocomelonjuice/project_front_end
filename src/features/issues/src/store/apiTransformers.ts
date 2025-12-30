/**
 * API Transformers for Issues
 * Transforms backend API responses to frontend format
 */

import type { Issue } from './states';

// Backend Issue response structure
interface BackendIssue {
  id: string;
  summary: string;
  description?: string;
  project: {
    id: string;
    key: string;
  };
  type?: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  } | null;
  priority?: {
    id: string;
    name: string;
    color?: string;
    level?: number;
  } | null;
  status?: {
    id: string;
    name: string;
    color?: string;
    category?: 'todo' | 'inprogress' | 'done';
  } | null;
  assignee?: {
    id: string;
    username: string;
    email: string;
    displayName: string;
  } | null;
  reporter?: {
    id: string;
    username: string;
    email: string;
    displayName: string;
  } | null;
  sprint?: {
    id: string;
    name: string;
  } | null;
  labels?: Array<{
    id: string;
    name: string;
    color?: string;
    description?: string;
  }>;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Generate issue key from project key and issue ID
 * Since backend doesn't provide sequence numbers, we'll use a short hash of the UUID
 */
const generateIssueKey = (projectKey: string, issueId: string): string => {
  // Use first 8 characters of UUID as sequence identifier
  // This is not ideal but works until backend adds sequence numbers
  const shortId = issueId.split('-')[0].toUpperCase();
  return `${projectKey}-${shortId}`;
};

/**
 * Transform backend issue to frontend issue
 */
export const transformIssue = (backendIssue: BackendIssue): Issue => {
  return {
    id: backendIssue.id,
    key: generateIssueKey(backendIssue.project.key, backendIssue.id),
    summary: backendIssue.summary,
    description: backendIssue.description,
    typeId: backendIssue.type?.id || '',
    type: backendIssue.type
      ? {
          id: backendIssue.type.id,
          name: backendIssue.type.name,
          icon: backendIssue.type.icon,
          color: backendIssue.type.color,
        }
      : undefined,
    priorityId: backendIssue.priority?.id || '',
    priority: backendIssue.priority
      ? {
          id: backendIssue.priority.id,
          name: backendIssue.priority.name,
          color: backendIssue.priority.color,
          level: backendIssue.priority.level,
        }
      : undefined,
    statusId: backendIssue.status?.id || '',
    status: backendIssue.status
      ? {
          id: backendIssue.status.id,
          name: backendIssue.status.name,
          color: backendIssue.status.color,
          category: backendIssue.status.category,
        }
      : undefined,
    assigneeId: backendIssue.assignee?.id,
    assignee: backendIssue.assignee
      ? {
          id: backendIssue.assignee.id,
          username: backendIssue.assignee.username,
          email: backendIssue.assignee.email,
          displayName: backendIssue.assignee.displayName,
        }
      : undefined,
    reporterId: backendIssue.reporter?.id || '',
    reporter: backendIssue.reporter
      ? {
          id: backendIssue.reporter.id,
          username: backendIssue.reporter.username,
          email: backendIssue.reporter.email,
          displayName: backendIssue.reporter.displayName,
        }
      : undefined,
    projectId: backendIssue.project.id,
    sprintId: backendIssue.sprint?.id,
    labelIds: backendIssue.labels?.map((label) => label.id),
    labels: backendIssue.labels?.map((label) => ({
      id: label.id,
      name: label.name,
      color: label.color,
      description: label.description,
    })),
    createdAt: backendIssue.createdAt instanceof Date ? backendIssue.createdAt.toISOString() : backendIssue.createdAt,
    updatedAt: backendIssue.updatedAt instanceof Date ? backendIssue.updatedAt.toISOString() : backendIssue.updatedAt,
  };
};

/**
 * Transform array of backend issues to frontend issues
 */
export const transformIssues = (backendIssues: BackendIssue[]): Issue[] => {
  return backendIssues.map(transformIssue);
};


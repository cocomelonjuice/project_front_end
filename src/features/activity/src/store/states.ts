/**
 * Activity Feature State
 */

import type { User } from '../../issues/src/store/states';

export interface AuditLog {
  id: string;
  userId?: string;
  user?: User;
  action: string; // 'create', 'update', 'delete', etc.
  entityType: string; // 'issue', 'project', 'user', etc.
  entityId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  description?: string;
  createdAt: string;
}

// Initial state
const initialState = {
  auditLogs: [] as AuditLog[],
  currentAuditLog: null as AuditLog | null,
  getAuditLogsLoading: false,
  getAuditLogByIdLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type ActivityState = typeof initialState;
export default initialState;



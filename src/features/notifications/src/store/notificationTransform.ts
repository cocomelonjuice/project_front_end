/**
 * Aligns API / socket notification JSON with Redux shape.
 * Extracts issue.id → top-level issueId (TypeORM synthetic FK can be non-enumerable in JSON),
 * and issue.projectId / issue.project.id → issue.projectId.
 */
export function normalizeNotificationFromApi(notification: unknown): unknown {
  if (!notification || typeof notification !== 'object') {
    return notification;
  }
  const n = notification as Record<string, unknown>;
  const issue = n.issue as Record<string, unknown> | undefined;
  if (!issue) return notification;

  const result: Record<string, unknown> = { ...n };

  // issueId may be missing if TypeORM synthetic property is non-enumerable
  if (!result.issueId) {
    const id = issue.id as string | undefined;
    if (id) result.issueId = id;
  }

  // ensure issue.projectId is present
  const existingProjectId = issue.projectId as string | undefined;
  const projectObj = issue.project as { id?: string } | undefined;
  const projectId = existingProjectId || projectObj?.id;
  if (projectId) {
    result.issue = { ...issue, projectId };
  }

  return result;
}

/**
 * Aligns API / socket notification JSON with Redux shape (e.g. issue.projectId).
 */
export function normalizeNotificationFromApi(notification: unknown): unknown {
  if (!notification || typeof notification !== 'object') {
    return notification;
  }
  const n = notification as Record<string, unknown>;
  const issue = n.issue as Record<string, unknown> | undefined;
  const project = issue?.project as { id?: string } | undefined;
  if (issue && project?.id) {
    return {
      ...n,
      issue: {
        ...issue,
        projectId: project.id,
      },
    };
  }
  return notification;
}

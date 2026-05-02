/**
 * Date utilities
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss');
}

export function formatDateOnly(date: Date | string): string {
  return formatDate(date, 'YYYY-MM-DD');
}

export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

export function isPastDueDate(
  dueDate?: Date | string | null,
  statusCategory?: string | null,
  statusName?: string | null,
): boolean {
  if (!dueDate) return false;
  const normalizedCategory = (statusCategory || '').toLowerCase();
  const normalizedName = (statusName || '').toLowerCase();
  if (normalizedCategory === 'done' || normalizedName.includes('done')) return false;

  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  if (Number.isNaN(due.getTime())) return false;

  const dueOnly = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const now = new Date();
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return dueOnly < todayOnly;
}


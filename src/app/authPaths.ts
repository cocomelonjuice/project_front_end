const AUTH_PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
] as const;

export function isAuthPublicPath(pathname: string): boolean {
  return (AUTH_PUBLIC_PATHS as readonly string[]).includes(pathname);
}

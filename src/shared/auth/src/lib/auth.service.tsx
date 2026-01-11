import { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

/**
 * Auth Service
 * Similar to vaccine-rsa-web-v2 packages/shared/auth/lib/auth.service.tsx
 */

// Auth state interface
export interface AuthState {
  user: any;
  role: any[] | null;
  permissions: any[] | null;
  functions: any[] | null;
}

// Auth context interface
export interface AuthContextType {
  auth: AuthState;
  checkRole: (r: string | string[], isNoCheckAdmin?: boolean) => boolean;
  checkPermissions: (per: string | string[], ecomBypass?: boolean) => boolean;
  checkFunctions: (func: string | string[]) => boolean;
}

const initialAuth: AuthState = {
  user: {},
  role: null,
  permissions: null,
  functions: null,
};

export const AuthStateContext = createContext<AuthContextType>({
  auth: initialAuth,
  checkRole: () => false,
  checkPermissions: () => false,
  checkFunctions: () => false,
});

/**
 * useAuth Hook
 * Provides authentication and permission checking
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Get auth data from Redux store
  type AppState = {
    [key: string]: any;
  };
  
  // Read from auth module instead of root
  const authState = useSelector((state: AppState) => state.auth || {});
  const user = authState.user || {};
  const roles = authState.roles || [];
  const permissions = authState.permissions || [];
  
  // Convert roles array to format expected by checkRole (array of objects with name property)
  const role = roles.length > 0 ? roles.map((roleName: string) => ({ name: roleName })) : null;

  /**
   * Check if user has required role
   */
  const checkRole = (r: string | string[], isNoCheckAdmin = true): boolean => {
    // If no roles and role is required, return false
    if (roles.length === 0 && (r || (Array.isArray(r) && r.length > 0))) return false;
    
    // If no role required, allow access
    if (!r || (Array.isArray(r) && r.length === 0)) return true;
    
    // Check if user has required role
    if (typeof r === 'string') {
      return roles.includes(r) || (isNoCheckAdmin && roles.includes('admin'));
    }
    
    // If is array, check if user has any of the required roles
    if (Array.isArray(r)) {
      return r.some((roleName) => roles.includes(roleName)) || (isNoCheckAdmin && roles.includes('admin'));
    }
    
    return false;
  };

  /**
   * Check if user has required permission
   */
  const checkPermissions = (per: string | string[], ecomBypass = false): boolean => {
    // Bypass for development (can be removed in production)
    if (ecomBypass) return true;

    // If no permission required, allow access
    if (!per || (Array.isArray(per) && per.length === 0)) return true;

    // Admin has all permissions
    if (roles.includes('admin')) return true;

    // Check if user has required permission
    if (typeof per === 'string') {
      return permissions.includes(per);
    }

    // If is array, check if user has any of the required permissions
    if (Array.isArray(per)) {
      return per.some((perm) => permissions.includes(perm));
    }

    return false;
  };

  /**
   * Check if user has required function
   */
  const checkFunctions = (func: string | string[]): boolean => {
    if (func && role !== null && functions !== null) {
      if (checkRole(roles.Admin)) return true; // Admin has all functions

      return functions.some((item: any) => {
        if (typeof func === 'string') {
          return item.name === func;
        }
        // If is array
        return func.includes(item.name);
      });
    }
    return true;
  };

  return {
    auth: { user, role, permissions, functions: null },
    checkRole,
    checkPermissions,
    checkFunctions: () => true, // Functions not implemented yet
  };
}


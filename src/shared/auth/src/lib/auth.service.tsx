import { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { roles } from './role';

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
  
  const { role, permissions, functions, user } = useSelector((state: AppState) => ({
    role: state.root?.role || null,
    permissions: state.root?.permissions || null,
    functions: state.root?.functions || null,
    user: state.root?.user || {},
  }));

  /**
   * Check if user has required role
   */
  const checkRole = (r: string | string[], isNoCheckAdmin = true): boolean => {
    if (!role && (r || (Array.isArray(r) && r.length > 0))) return false;
    if (r && role !== null) {
      return role.some((item: any) => {
        if (typeof r === 'string') {
          return item.name === r || (isNoCheckAdmin && item.name === roles.Admin);
        }
        // If is array
        return [roles.Admin, ...r].includes(item.name);
      });
    }
    return true;
  };

  /**
   * Check if user has required permission
   */
  const checkPermissions = (per: string | string[], ecomBypass = false): boolean => {
    // Bypass for development (can be removed in production)
    if (ecomBypass) return true;

    if (per && role !== null && permissions !== null) {
      return permissions.some((item: any) => {
        if (typeof per === 'string') {
          return item.permissionName === per;
        }
        // If is array
        return per.includes(item.permissionName);
      });
    }

    return true;
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
    auth: { user, role, permissions, functions },
    checkRole,
    checkPermissions,
    checkFunctions,
  };
}


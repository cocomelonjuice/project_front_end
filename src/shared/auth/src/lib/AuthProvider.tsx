import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { rootActions } from '../../../../store';
import { AuthStateContext, useAuth as useAuthInternal } from './auth.service';
import type { AppDispatch } from '../../../../store';

/**
 * Auth Provider Component
 * Similar to vaccine-rsa-web-v2 packages/shared/auth
 * 
 * Provides authentication context and initializes auth data
 */

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Initialize auth data on mount
  useEffect(() => {
    // TODO: add role and permission, routing
    // // Fetch role and permissions
    // // In a real app, this would be called after login
    // dispatch(
    //   rootActions.getRoleRequest({
    //     data: {},
    //     callback: {
    //       onSuccess: (data: any) => {
    //         console.log('Role loaded:', data);
    //       },
    //     },
    //   } as any)
    // );

    // dispatch(
    //   rootActions.getPermissionsRequest({
    //     data: {},
    //     callback: {
    //       onSuccess: (data: any) => {
    //         console.log('Permissions loaded:', data);
    //       },
    //     },
    //   } as any)
    // );

    // Set mock user for demo
    dispatch(
      rootActions.setUser({
        data: { id: '1', name: 'Demo User', email: 'demo@example.com' },
      } as any)
    );
  }, [dispatch]);

  // Get auth data from store
  const authData = useAuthInternal();

  return (
    <AuthStateContext.Provider
      value={{
        auth: authData.auth,
        checkRole: authData.checkRole,
        checkPermissions: authData.checkPermissions,
        checkFunctions: authData.checkFunctions,
      }}
    >
      {children}
    </AuthStateContext.Provider>
  );
};


import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { authActions } from '../../../../features/auth/src/store';
import { AuthStateContext, useAuth as useAuthInternal } from './auth.service';
import type { AppDispatch } from '../../../../store';
import { isAuthPublicPath } from '../../../../app/authPaths';

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
  const location = useLocation();

  // Initialize auth data on mount
  useEffect(() => {
    const isPublicRoute = isAuthPublicPath(location.pathname);

    // Don't fetch profile on public routes (login/register) - return early
    // This prevents any API calls or state updates on login/register pages
    if (isPublicRoute) {
      return;
    }

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    // Only proceed if we have a token AND we're not on a public route
    // Double-check public route to be safe
    if (!token || isPublicRoute) {
      return;
    }

    // If user data exists in localStorage, restore it
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Restore auth state from localStorage
        dispatch(authActions.loginSuccess({ data: { user, accessToken: token } } as any));
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
        // If parsing fails, clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      }
    }

    // Always try to fetch fresh user data from API
    dispatch(
      authActions.getProfileRequest({
        data: {},
        callback: {
          onSuccess: () => {
            // User profile loaded successfully
          },
          onError: () => {
            // If profile fetch fails, clear auth state
            dispatch(authActions.logout());
          },
        },
      } as any)
    );

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
  }, [dispatch, location.pathname]);

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


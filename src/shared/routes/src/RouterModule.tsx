import { useAuth } from '../../auth/src';
import { Outlet, Route, Routes } from 'react-router-dom';
import { Page401 } from '../../ui/exception/Page401';
import React from 'react';

/**
 * Router Module
 * Similar to vaccine-rsa-web-v2 packages/shared/routes/src/RouterModule.tsx
 * 
 * Provides permission-aware routing
 */

export interface RouteType {
  path: string;
  element?: React.ComponentType<any>;
  name?: string;
  permission?: string | string[];
  role?: string | string[];
  children?: RouteType[];
  loader?: any;
  action?: any;
  errorElement?: any;
  handle?: any;
}

export type RoutesType = RouteType[];

interface RoutersType {
  routes: RoutesType;
}

/**
 * Main Router Component
 * Maps routes and applies permission checking
 */
export const Routers = ({ routes }: RoutersType) => {
  const authentication = useAuth();

  return (
    <Routes>
      {routes.map((route: RouteType, index) =>
        SubRouter({ indexRoute: index, authentication, ...route })
      )}
    </Routes>
  );
};

interface SubRouterType extends RouteType {
  authentication: ReturnType<typeof useAuth>;
  indexRoute: number | string;
}

/**
 * Sub Router Component
 * Handles permission checking for individual routes
 */
export const SubRouter = (props: SubRouterType) => {
  const {
    indexRoute,
    path,
    element: Element,
    loader,
    action,
    errorElement,
    children,
    handle,
    name,
    authentication,
    permission: _permission, // TODO: add role and permission, routing
    role: _role, // TODO: add role and permission, routing
  } = props;

  // TODO: add role and permission, routing
  // const { checkPermissions, checkRole } = authentication;

  // // Check role if required
  // const isRoleValid = checkRole(role || []);

  // // Check permission if required
  // const ecomBypass = false; // Set to true to bypass permission checks (dev only)
  // const isPermissionValid = checkPermissions(permission || [], ecomBypass);

  // // Route is valid if both role and permission checks pass
  // const isValid = isRoleValid && isPermissionValid;

  return (
    <Route
      id={`${path}_${indexRoute}`}
      key={`${path}_${indexRoute}`}
      path={path}
      element={(() => {
        // TODO: add role and permission, routing
        // // Show 401 if user doesn't have permission
        // if (!isValid) return <Page401 />;
        
        // Render component if provided
        if (Element) return <Element name={name} />;
        
        // Render outlet for nested routes
        if (children) return <Outlet />;
        
        // Default to 401 if no element
        return <Page401 />;
      })()}
      loader={loader}
      action={action}
      errorElement={errorElement}
      handle={handle}
    >
      {children
        ? children.map((childRoute: RouteType, childIndex) =>
            SubRouter({
              indexRoute: `${path}_${indexRoute}_${childIndex}`,
              authentication,
              ...childRoute,
            })
          )
        : null}
    </Route>
  );
};


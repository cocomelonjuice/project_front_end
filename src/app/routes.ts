import { routeDefinitions } from '../shared/navigation/src';
import { Page404 } from '../shared/ui/exception';
import type { RouteType, RoutesType } from '../shared/routes/src';
import type { RouteDefinition } from '../shared/navigation/src';

/**
 * Routes Configuration
 * Similar to vaccine-rsa-web-v2 apps/portal/src/app/routes.ts
 */

export const publicRoutes: RoutesType = [
  {
    path: '*',
    element: Page404,
  },
];

export const privateRoutes: RoutesType = [
  ...routeDefinitions.flatMap((route: RouteDefinition): RouteType[] => {
    if (route.child) {
      return route.child.map((child: RouteDefinition): RouteType => ({
        name: child.componentName,
        path: child.path,
        element: child.component,
        // TODO: add role and permission, routing
        // permission: child.permissions ? [child.permissions] : undefined,
        // role: child.role,
      }));
    }

    return [
      {
        name: route.componentName,
        path: route.path,
        element: route.component,
        // TODO: add role and permission, routing
        // permission: route.permissions ? [route.permissions] : undefined,
        // role: route.role,
      },
    ];
  }),
  {
    path: '*',
    element: Page404,
  },
];

export default {
  publicRoutes,
  privateRoutes,
};


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

import IssueDetail from '../pages/issues/IssueDetail';
import ProjectDetail from '../pages/projects/ProjectDetail';
import WorkflowsList from '../pages/workflows/WorkflowsList';
import WorkflowDetail from '../pages/workflows/WorkflowDetail';
import AdminDashboard from '../pages/admin/AdminDashboard';

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
    name: 'ProjectDetail',
    path: '/projects/:id',
    element: ProjectDetail,
  },
  {
    name: 'IssueDetail',
    path: '/projects/:projectId/issues/:issueId',
    element: IssueDetail,
  },
  {
    name: 'WorkflowsList',
    path: '/workflows',
    element: WorkflowsList,
  },
  {
    name: 'WorkflowDetail',
    path: '/workflows/:id',
    element: WorkflowDetail,
  },
  {
    name: 'AdminDashboard',
    path: '/admin',
    element: AdminDashboard,
  },
  {
    path: '*',
    element: Page404,
  },
];

export default {
  publicRoutes,
  privateRoutes,
};


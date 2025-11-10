// import { permissions } from '../../auth/src';
import Home from '../../../pages/Home';
import About from '../../../pages/About';
import type { ComponentType, ReactNode } from 'react';

/**
 * Navigation Definitions
 * Similar to vaccine-rsa-web-v2 libs/portal/common/src/navigation.tsx
 */

export interface RouteDefinition {
  id: string;
  path: string;
  label: string;
  componentName: string;
  component: ComponentType<any>;
  iconNavigation?: ReactNode;
  menuIcon?: string;
  permissions?: string;
  role?: string | string[];
  child?: RouteDefinition[];
  showInHomeMenu?: boolean;
  showInNavigation?: boolean;
}

/**
 * Route definitions with permissions
 * Add your routes here with their permissions
 */
export const routeDefinitions: RouteDefinition[] = [
  {
    id: 'home',
    path: '/',
    label: 'Home',
    componentName: 'Home',
    component: Home,
    showInHomeMenu: false,
  },
  {
    id: 'about',
    path: '/about',
    label: 'About',
    componentName: 'About',
    component: About,
    // Example: Add permission to route
    // permissions: permissions.DataManagement.Menu,
  },
  // Add more routes here with permissions
  // {
  //   id: 'data-management',
  //   path: '/data-management',
  //   label: 'Data Management',
  //   componentName: 'DataManagement',
  //   component: DataManagement,
  //   permissions: permissions.DataManagement.Menu,
  // },
];


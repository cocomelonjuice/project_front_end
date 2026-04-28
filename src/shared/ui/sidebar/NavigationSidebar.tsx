import React from 'react';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  AccountTree as WorkflowIcon,
  AdminPanelSettings as AdminIcon,
  Info as AboutIcon,
} from '@mui/icons-material';
import { BaseSidebar } from './BaseSidebar';
import type { SidebarGroup, SidebarNavItem } from './types';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/src';

export interface NavigationSidebarProps {
  /**
   * Whether the sidebar is collapsed
   */
  collapsed?: boolean;
  /**
   * Callback when an item is clicked
   */
  onItemClick?: (item: SidebarNavItem) => void;
}

/**
 * NavigationSidebar Component
 * 
 * Main navigation sidebar for the application.
 * Features:
 * - Primary navigation (Projects, Workflows)
 * - Secondary navigation (Admin, About)
 * 
 * @example
 * ```tsx
 * <NavigationSidebar
 *   collapsed={false}
 *   onItemClick={(item) => console.log(item)}
 * />
 * ```
 */
export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  collapsed = false,
  onItemClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { checkRole } = useAuth();
  const [optimisticPath, setOptimisticPath] = React.useState<string | null>(null);
  
  // Check if user has admin role
  const isAdmin = checkRole('admin');
  const currentPath = optimisticPath ?? location.pathname;

  React.useEffect(() => {
    setOptimisticPath(null);
  }, [location.pathname]);

  // Primary navigation items - main features
  const primaryNavItems: SidebarNavItem[] = React.useMemo(
    () => [
      {
        id: 'home',
        label: t('nav.projects'),
        icon: <HomeIcon />,
        path: '/',
        active: currentPath === '/' || currentPath.startsWith('/projects'),
      },
      {
        id: 'dashboard',
        label: t('nav.dashboard'),
        icon: <DashboardIcon />,
        path: '/dashboard',
        active: currentPath === '/dashboard',
      },
      {
        id: 'workflows',
        label: t('nav.workflows'),
        icon: <WorkflowIcon />,
        path: '/workflows',
        active: currentPath.startsWith('/workflows'),
      },
    ],
    [currentPath, t]
  );

  // Secondary navigation items - admin and info
  const secondaryNavItems: SidebarNavItem[] = React.useMemo(
    () => [
      // Only show Admin menu item if user has admin role
      ...(isAdmin
        ? [
            {
              id: 'admin',
              label: t('nav.admin'),
              icon: <AdminIcon />,
              path: '/admin',
              active: currentPath.startsWith('/admin'),
            },
          ]
        : []),
      {
        id: 'about',
        label: t('nav.about'),
        icon: <AboutIcon />,
        path: '/about',
        active: currentPath === '/about',
      },
    ],
    [currentPath, isAdmin, t]
  );

  const handleItemClick = React.useCallback((item: SidebarNavItem) => {
    if (item.path && !item.external) {
      setOptimisticPath(item.path);
    }

    if (onItemClick) {
      onItemClick(item);
    }

    if (item.path && !item.external) {
      navigate(item.path);
    } else if (item.path && item.external) {
      // Handle external links
      window.open(item.path, '_blank');
    }
  }, [navigate, onItemClick]);

  const sidebarGroups: SidebarGroup[] = React.useMemo(
    () => [
      {
        id: 'primary',
        sections: [
          {
            id: 'primary-nav',
            items: primaryNavItems,
          },
        ],
      },
      {
        id: 'secondary',
        sections: [
          {
            id: 'secondary-nav',
            items: secondaryNavItems,
          },
        ],
      },
    ],
    [primaryNavItems, secondaryNavItems]
  );

  return (
    <BaseSidebar
      collapsed={collapsed}
      groups={sidebarGroups}
      onItemClick={handleItemClick}
      activeItemId={currentPath}
    />
  );
};

export default NavigationSidebar;


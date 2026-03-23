import React from 'react';
import {
  Home as HomeIcon,
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
  
  // Check if user has admin role
  const isAdmin = checkRole('admin');

  // Primary navigation items - main features
  const primaryNavItems: SidebarNavItem[] = [
    {
      id: 'home',
      label: t('nav.projects'),
      icon: <HomeIcon />,
      path: '/',
      active: location.pathname === '/' || location.pathname.startsWith('/projects'),
    },
    {
      id: 'workflows',
      label: t('nav.workflows'),
      icon: <WorkflowIcon />,
      path: '/workflows',
      active: location.pathname.startsWith('/workflows'),
    },
  ];

  // Secondary navigation items - admin and info
  const secondaryNavItems: SidebarNavItem[] = [
    // Only show Admin menu item if user has admin role
    ...(isAdmin
      ? [
          {
            id: 'admin',
            label: t('nav.admin'),
            icon: <AdminIcon />,
            path: '/admin',
            active: location.pathname.startsWith('/admin'),
          },
        ]
      : []),
    {
      id: 'about',
      label: t('nav.about'),
      icon: <AboutIcon />,
      path: '/about',
      active: location.pathname === '/about',
    },
  ];

  const handleItemClick = (item: SidebarNavItem) => {
    if (item.path && !item.external) {
      navigate(item.path);
    } else if (item.path && item.external) {
      // Handle external links
      window.open(item.path, '_blank');
    }

    if (onItemClick) {
      onItemClick(item);
    }
  };

  const sidebarGroups: SidebarGroup[] = [
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
  ];

  return (
    <BaseSidebar
      collapsed={collapsed}
      groups={sidebarGroups}
      onItemClick={handleItemClick}
      activeItemId={location.pathname}
    />
  );
};

export default NavigationSidebar;


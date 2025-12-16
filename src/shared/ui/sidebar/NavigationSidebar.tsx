import React from 'react';
import { Box } from '@mui/material';
import {
  Person as PersonIcon,
  AccessTime as RecentIcon,
  StarBorder as StarredIcon,
  Apps as AppsIcon,
  ViewQuilt as PlansIcon,
  Public as SpacesIcon,
  Add as AddIcon,
  MoreHoriz as MoreIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  HeadsetMic as HeadsetIcon,
  AccountTree as RoadmapIcon,
  ViewList as ViewAllIcon,
  OpenInNew as ExternalIcon,
  AccountTree as WorkflowIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { BaseSidebar } from './BaseSidebar';
import type { SidebarGroup, SidebarNavItem } from './types';
import { useNavigate, useLocation } from 'react-router-dom';

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
 * A sidebar implementation based on Confluence-style navigation.
 * Features:
 * - Primary navigation (For you, Recent, Starred, Apps, Plans, Spaces)
 * - Recent items section
 * - Recommended section
 * - Categorized links
 * - External application links
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

  // Primary navigation items
  const primaryNavItems: SidebarNavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <HomeIcon />,
      path: '/',
      active: location.pathname === '/',
    },
    {
      id: 'workflows',
      label: 'Workflows',
      icon: <WorkflowIcon />,
      path: '/workflows',
      active: location.pathname.startsWith('/workflows'),
    },
  ];

  // Recent spaces items
  const recentSpacesItems: SidebarNavItem[] = [
    {
      id: 'test-project',
      label: 'Test_Project',
      icon: (
        <Box
          component="span"
          sx={{
            width: 24,
            height: 24,
            borderRadius: '4px',
            backgroundColor: '#0052CC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#fff',
          }}
        >
          TP
        </Box>
      ),
      path: '/spaces/test-project',
      active: location.pathname === '/spaces/test-project',
    },
    {
      id: 'company-test-project',
      label: 'COMPANY_TEST_PROJECT',
      icon: (
        <Box
          component="span"
          sx={{
            width: 24,
            height: 24,
            borderRadius: '4px',
            backgroundColor: '#4FC3F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#fff',
          }}
        >
          CP
        </Box>
      ),
      path: '/spaces/company-test-project',
    },
    {
      id: 'support',
      label: 'Support',
      icon: (
        <Box
          component="span"
          sx={{
            width: 24,
            height: 24,
            borderRadius: '4px',
            backgroundColor: '#4FC3F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#fff',
          }}
        >
          S
        </Box>
      ),
      path: '/spaces/support',
    },
  ];

  // Recommended items
  const recommendedItems: SidebarNavItem[] = [
    {
      id: 'create-roadmap',
      label: 'Create a roadmap',
      icon: (
        <Box
          component="span"
          sx={{
            width: 24,
            height: 24,
            borderRadius: '4px',
            backgroundColor: '#7C3AED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#fff',
          }}
        >
          R
        </Box>
      ),
      path: '/create-roadmap',
      actionButton: {
        label: 'TRY',
        onClick: () => {
          console.log('Try roadmap clicked');
        },
        variant: 'outlined',
        color: 'secondary',
      },
    },
    {
      id: 'view-all-spaces',
      label: 'View all spaces',
      icon: <ViewAllIcon />,
      path: '/spaces/all',
    },
  ];

  // Categorized links
  const categorizedItems: SidebarNavItem[] = [
    {
      id: 'admin',
      label: 'Admin',
      icon: <AdminIcon />,
      path: '/admin',
      active: location.pathname.startsWith('/admin'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <SettingsIcon />,
      expandable: true,
      path: '/settings',
    },
  ];

  // External application links
  const externalAppItems: SidebarNavItem[] = [
    {
      id: 'confluence',
      label: 'Confluence',
      icon: (
        <Box
          component="span"
          sx={{
            width: 24,
            height: 24,
            borderRadius: '4px',
            backgroundColor: '#0052CC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#fff',
          }}
        >
          C
        </Box>
      ),
      path: '/external/confluence',
      external: true,
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: (
        <Box
          component="span"
          sx={{
            width: 24,
            height: 24,
            borderRadius: '4px',
            backgroundColor: '#FFB300',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#fff',
          }}
        >
          A
        </Box>
      ),
      path: '/external/assets',
      external: true,
    },
    {
      id: 'teams',
      label: 'Teams',
      icon: (
        <Box
          component="span"
          sx={{
            width: 24,
            height: 24,
            borderRadius: '4px',
            backgroundColor: '#424242',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#fff',
          }}
        >
          T
        </Box>
      ),
      path: '/external/teams',
      external: true,
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
      id: 'spaces',
      sections: [
        {
          id: 'recent-spaces',
          title: 'Recent',
          items: recentSpacesItems,
        },
      ],
    },
    {
      id: 'recommended',
      sections: [
        {
          id: 'recommended-items',
          title: 'Recommended',
          items: recommendedItems,
        },
      ],
    },
    {
      id: 'categories',
      sections: [
        {
          id: 'categorized-links',
          items: categorizedItems,
        },
      ],
    },
    {
      id: 'external',
      sections: [
        {
          id: 'external-apps',
          items: externalAppItems,
        },
        {
          id: 'more',
          items: [
            {
              id: 'more',
              label: 'More',
              icon: <MoreIcon />,
              path: '/more',
            },
          ],
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


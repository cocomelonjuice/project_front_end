import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Box, LinearProgress } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GlobalHeader } from '../shared/ui/header';
import { NavigationSidebar } from '../shared/ui/sidebar';
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { APP_CONFIG } from '../shared/constants/src/config';
import {
  NotificationsDropdown,
  NotificationsRealtimeBridge,
} from '../features/notifications/src';
import { authActions } from '../features/auth/src/store';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ChatPanel } from '../features/chat/src';
import type { SidebarNavItem } from '../shared/ui/sidebar';
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleSidebarToggle = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Add your sidebar toggle logic here
  }, [sidebarCollapsed]);

  const handleSearch = useCallback((query: string) => {
    // Search functionality - to be implemented
    // For now, if on home page, could filter projects
    // Could navigate to search results page in the future
    if (query.trim()) {
      // Future: Implement global search
      console.log('Search query:', query);
    }
  }, []);

  const handleCreate = useCallback(() => {
    // Create functionality - navigate to home where create project button is available
    // Future: Could show a menu with options (Create Project, Create Issue, etc.)
    navigate('/');
  }, [navigate]);


  const handleHelp = useCallback(() => {
    // Help functionality - could open help documentation or support page
    // For now, could navigate to an about/help page
    navigate('/about');
  }, [navigate]);
  const handleLogout = useCallback(() => {
    // Dispatch logout action to clear Redux state
    dispatch(authActions.logout());
    // Redirect to login page
    navigate('/login');
  }, [dispatch, navigate]);

  const userMenuItems = useMemo(
    () => [
      {
        label: t('layout.dashboard'),
        onClick: () => {
          navigate('/dashboard');
        },
        icon: <DashboardIcon fontSize="small" />,
      },
      {
        label: t('layout.profile'),
        onClick: () => {
          navigate('/profile');
        },
        icon: <PersonIcon fontSize="small" />,
      },
      {
        label: t('layout.logout'),
        onClick: handleLogout,
        icon: <LogoutIcon fontSize="small" />,
      },
    ],
    [handleLogout, navigate, t]
  );

  const handleSidebarItemClick = useCallback(
    (item: SidebarNavItem) => {
      if (item.path && !item.external && item.path !== location.pathname) {
        setIsNavigating(true);
      }
    },
    [location.pathname]
  );

  useEffect(() => {
    if (!isNavigating) return;
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 220);
    return () => clearTimeout(timer);
  }, [isNavigating, location.pathname]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <NotificationsRealtimeBridge />
      <GlobalHeader
        appName={APP_CONFIG.NAME}//SoftPlace Project Management 
        onSidebarToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
        onSearch={handleSearch}
        searchPlaceholder={t('header.searchPlaceholder')}
        onCreateClick={handleCreate}
        createButtonText={t('common.create')}
        extraActions={<LanguageSwitcher />}
        // Trial info removed - not needed for this project
        // trialInfo={{
        //   daysLeft: 26,
        //   onClick: () => {
        //     // Trial/plan logic
        //   },
        // }}
        notificationComponent={<NotificationsDropdown />}
        onHelpClick={handleHelp}
        userMenuItems={userMenuItems}
        showAppLauncher={false}
        onAppLauncherClick={() => {
          // App launcher functionality
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          minHeight: 0, // Important for flex children to respect overflow
        }}
      >
        <NavigationSidebar collapsed={sidebarCollapsed} onItemClick={handleSidebarItemClick} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            overscrollBehavior: 'contain',
            backgroundColor: '#f5f5f5',
            p: 3,
            minWidth: 0, // Important for flex children to respect overflow
            /* Steady scrollbar (no hover/show-hide) avoids width flicker next to fixed FAB */
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0, 0, 0, 0.25) rgba(0, 0, 0, 0.06)',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0, 0, 0, 0.05)',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.22)',
              borderRadius: '4px',
            },
          }}
        >
          {isNavigating && (
            <Box sx={{ mb: 1 }}>
              <LinearProgress />
            </Box>
          )}
          {children}
        </Box>
      </Box>
      <ChatPanel />
    </Box>
  );
};

export default Layout; 
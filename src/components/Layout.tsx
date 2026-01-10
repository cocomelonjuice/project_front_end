import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GlobalHeader } from '../shared/ui/header';
import { NavigationSidebar } from '../shared/ui/sidebar';
import { Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import { APP_CONFIG } from '../shared/constants/src/config';
import { NotificationsDropdown } from '../features/notifications/src';
import type { Notification } from '../features/notifications/src/store/states';
import { authActions } from '../features/auth/src/store';
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // Notifications state - using empty array since notifications API is skipped
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Add your sidebar toggle logic here
  };

  const handleSearch = (query: string) => {
    // Search functionality - to be implemented
    // For now, if on home page, could filter projects
    // Could navigate to search results page in the future
    if (query.trim()) {
      // Future: Implement global search
      console.log('Search query:', query);
    }
  };

  const handleCreate = () => {
    // Create functionality - navigate to home where create project button is available
    // Future: Could show a menu with options (Create Project, Create Issue, etc.)
    navigate('/');
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.issueId) {
      // Navigate to the issue detail page
      const projectId = notification.issue?.projectId;
      if (projectId) {
        navigate(`/projects/${projectId}/issues/${notification.issueId}`);
      }
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleHelp = () => {
    // Help functionality - could open help documentation or support page
    // For now, could navigate to an about/help page
    navigate('/about');
  };

  const handleSettings = () => {
    // Settings functionality - could navigate to settings page
    // For now, navigate to admin if user has permissions, or show message
    navigate('/admin');
  };

  const handleLogout = () => {
    // Dispatch logout action to clear Redux state
    dispatch(authActions.logout());
    // Redirect to login page
    navigate('/login');
  };

  const userMenuItems = [
    {
      label: 'Profile',
      onClick: () => {
        navigate('/profile');
      },
      icon: <PersonIcon fontSize="small" />,
    },
    {
      label: 'Logout',
      onClick: handleLogout,
      icon: <LogoutIcon fontSize="small" />,
    },
  ];

  // Handle scroll to show scrollbar when scrolling in main content
  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;

    const handleScroll = () => {
      setIsScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Hide scrollbar after scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    mainContent.addEventListener('scroll', handleScroll);
    
    return () => {
      mainContent.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <GlobalHeader
        appName={APP_CONFIG.NAME}//SoftPlace Project Management 
        onSidebarToggle={handleSidebarToggle}
        sidebarCollapsed={sidebarCollapsed}
        onSearch={handleSearch}
        searchPlaceholder="Search"
        onCreateClick={handleCreate}
        createButtonText="Create"
        // Trial info removed - not needed for this project
        // trialInfo={{
        //   daysLeft: 26,
        //   onClick: () => {
        //     // Trial/plan logic
        //   },
        // }}
        notificationComponent={
          <NotificationsDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            onNotificationClick={handleNotificationClick}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        }
        onHelpClick={handleHelp}
        onSettingsClick={handleSettings}
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
        <NavigationSidebar collapsed={sidebarCollapsed} />
        <Box
          ref={mainContentRef}
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: '#f5f5f5',
            p: 3,
            minWidth: 0, // Important for flex children to respect overflow
            // Hide scrollbar by default, show on hover or when scrolling
            scrollbarWidth: 'thin',
            scrollbarColor: isScrolling 
              ? 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)' 
              : 'transparent transparent',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: isScrolling ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isScrolling ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
              borderRadius: '4px',
            },
            '&:hover': {
              scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)',
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              },
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 
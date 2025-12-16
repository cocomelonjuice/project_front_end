import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GlobalHeader } from '../shared/ui/header';
import { NavigationSidebar } from '../shared/ui/sidebar';
import { Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import { APP_CONFIG } from '../shared/constants/src/config';
import { NotificationsDropdown } from '../features/notifications/src';
import { mockNotifications } from '../features/notifications/src/store/mockData';
import type { Notification } from '../features/notifications/src/store/states';
interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Add your sidebar toggle logic here
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Add your search logic here
  };

  const handleCreate = () => {
    console.log('Create clicked');
    // Add your create logic here, e.g., navigate('/create')
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.issueId) {
      // Navigate to the issue detail page
      const projectId = notification.issue?.projectId || '1'; // Fallback to project 1
      navigate(`/projects/${projectId}/issues/${notification.issueId}`);
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
    console.log('Help clicked');
    // Add your help logic here
  };

  const handleSettings = () => {
    console.log('Settings clicked');
    // Add your settings logic here
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout clicked');
    // Example: localStorage.removeItem('token');
    // navigate('/login');
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
        trialInfo={{
          daysLeft: 26,
          onClick: () => {
            console.log('Trial info clicked');
            // Add your trial/plan logic here
          },
        }}
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
        showAppLauncher={true}
        onAppLauncherClick={() => {
          console.log('App launcher clicked');
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
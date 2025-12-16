import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Button,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Apps as AppsIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  HelpOutline as HelpIcon,
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '../../auth/src';
import type { ReactNode } from 'react';

export interface GlobalHeaderProps {
  /**
   * Logo component or image
   */
  logo?: ReactNode;
  /**
   * Application name to display
   */
  appName?: string;
  /**
   * Callback when sidebar toggle is clicked
   */
  onSidebarToggle?: () => void;
  /**
   * Whether sidebar is collapsed
   */
  sidebarCollapsed?: boolean;
  /**
   * Callback when search is performed
   */
  onSearch?: (query: string) => void;
  /**
   * Search placeholder text
   */
  searchPlaceholder?: string;
  /**
   * Callback when create button is clicked
   */
  onCreateClick?: () => void;
  /**
   * Create button text
   */
  createButtonText?: string;
  /**
   * Trial/plan information to display
   */
  trialInfo?: {
    daysLeft: number;
    onClick?: () => void;
  };
  /**
   * Notification count (deprecated - use notificationComponent instead)
   */
  notificationCount?: number;
  /**
   * Callback when notifications are clicked (deprecated - use notificationComponent instead)
   */
  onNotificationsClick?: () => void;
  /**
   * Custom notification component (replaces notificationCount and onNotificationsClick)
   */
  notificationComponent?: ReactNode;
  /**
   * Callback when help is clicked
   */
  onHelpClick?: () => void;
  /**
   * Callback when settings are clicked
   */
  onSettingsClick?: () => void;
  /**
   * User menu items
   */
  userMenuItems?: Array<{
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  }>;
  /**
   * User avatar URL
   */
  userAvatarUrl?: string;
  /**
   * User name to display
   */
  userName?: string;
  /**
   * Show app launcher button
   */
  showAppLauncher?: boolean;
  /**
   * Callback when app launcher is clicked
   */
  onAppLauncherClick?: () => void;
}

/**
 * GlobalHeader Component
 * 
 * A reusable global header component inspired by Confluence-style navigation.
 * Features:
 * - Sidebar toggle
 * - App launcher
 * - Logo and app name
 * - Search bar
 * - Create button
 * - Trial/plan indicator
 * - Notifications
 * - Help
 * - Settings
 * - User menu
 * 
 * @example
 * ```tsx
 * <GlobalHeader
 *   appName="My App"
 *   onSidebarToggle={() => setCollapsed(!collapsed)}
 *   onCreateClick={() => navigate('/create')}
 *   onSearch={(query) => console.log(query)}
 * />
 * ```
 */
export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  logo,
  appName = 'My App',
  onSidebarToggle,
  sidebarCollapsed = false,
  onSearch,
  searchPlaceholder = 'Search',
  onCreateClick,
  createButtonText = 'Create',
  trialInfo,
  notificationCount = 0,
  onNotificationsClick,
  notificationComponent,
  onHelpClick,
  onSettingsClick,
  userMenuItems = [],
  userAvatarUrl,
  userName,
  showAppLauncher = true,
  onAppLauncherClick,
}) => {
  const { auth } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [appLauncherAnchor, setAppLauncherAnchor] = useState<null | HTMLElement>(null);

  // Get user name from auth if not provided
  const displayUserName = userName || auth.user?.profile?.full_name || auth.user?.profile?.name || 'User';
  const displayUserInitials = displayUserName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleAppLauncherOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAppLauncherAnchor(event.currentTarget);
  };

  const handleAppLauncherClose = () => {
    setAppLauncherAnchor(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        color: '#333',
        height: '56px',
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: '56px !important',
          height: '56px',
          paddingX: { xs: 1, sm: 2 },
          justifyContent: 'space-between',
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Sidebar Toggle */}
          {onSidebarToggle && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="toggle sidebar"
              onClick={onSidebarToggle}
              sx={{
                color: '#666',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              }}
            >
              {sidebarCollapsed ? <MenuIcon /> : <ArrowBackIcon />}
            </IconButton>
          )}

          {/* App Launcher */}
          {showAppLauncher && (
            <>
              <IconButton
                color="inherit"
                aria-label="app launcher"
                onClick={handleAppLauncherOpen}
                sx={{
                  color: '#666',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                <AppsIcon />
              </IconButton>
              <Menu
                anchorEl={appLauncherAnchor}
                open={Boolean(appLauncherAnchor)}
                onClose={handleAppLauncherClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <MenuItem onClick={handleAppLauncherClose}>App 1</MenuItem>
                <MenuItem onClick={handleAppLauncherClose}>App 2</MenuItem>
                <MenuItem onClick={handleAppLauncherClose}>App 3</MenuItem>
              </Menu>
            </>
          )}

          {/* Logo */}
          {logo && <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>{logo}</Box>}

          {/* App Name */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 500,
              color: '#333',
              fontSize: '16px',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {appName}
            
          </Typography>
        </Box>

        {/* Center Section - Search */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            flex: { xs: 0.8, md: 0.4 },
            maxWidth: '600px',
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '6px',
            padding: '0 12px',
            height: '36px',
            marginX: 2,
          }}
        >
          <SearchIcon sx={{ color: '#999', fontSize: '20px', mr: 1 }} />
          <InputBase
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              fontSize: '14px',
              '& .MuiInputBase-input': {
                padding: 0,
              },
            }}
          />
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Create Button */}
          {onCreateClick && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateClick}
              sx={{
                backgroundColor: '#0052CC',
                color: '#fff',
                borderRadius: '6px',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                paddingX: 2,
                paddingY: 0.75,
                '&:hover': {
                  backgroundColor: '#0065FF',
                },
                display: { xs: 'none', sm: 'flex' },
              }}
            >
              {createButtonText}
            </Button>
          )}

          {/* Trial Info */}
          {trialInfo && (
            <Chip
              icon={<Box component="span" sx={{ fontSize: '16px' }}>💎</Box>}
              label={`${trialInfo.daysLeft} days left`}
              onClick={trialInfo.onClick}
              sx={{
                borderColor: '#7C3AED',
                color: '#7C3AED',
                borderWidth: '1px',
                borderStyle: 'solid',
                backgroundColor: 'transparent',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 500,
                height: '36px',
                '&:hover': {
                  backgroundColor: 'rgba(124, 58, 237, 0.08)',
                },
                display: { xs: 'none', md: 'flex' },
              }}
              variant="outlined"
            />
          )}

          {/* Notifications */}
          {notificationComponent ? (
            notificationComponent
          ) : (
            onNotificationsClick && (
              <IconButton
                color="inherit"
                aria-label="notifications"
                onClick={onNotificationsClick}
                sx={{
                  color: '#666',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                }}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            )
          )}

          {/* Help */}
          {onHelpClick && (
            <IconButton
              color="inherit"
              aria-label="help"
              onClick={onHelpClick}
              sx={{
                color: '#666',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              }}
            >
              <HelpIcon />
            </IconButton>
          )}

          {/* Settings */}
          {onSettingsClick && (
            <IconButton
              color="inherit"
              aria-label="settings"
              onClick={onSettingsClick}
              sx={{
                color: '#666',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              }}
            >
              <SettingsIcon />
            </IconButton>
          )}

          {/* User Avatar */}
          <IconButton
            onClick={handleUserMenuOpen}
            sx={{
              padding: 0.5,
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <Avatar
              src={userAvatarUrl}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: '#7C3AED',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {!userAvatarUrl && displayUserInitials}
            </Avatar>
          </IconButton>

          {/* User Menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem disabled>
              <Box sx={{ display: 'flex', flexDirection: 'column', paddingY: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {displayUserName}
                </Typography>
                {auth.user?.profile?.email && (
                  <Typography variant="caption" color="text.secondary">
                    {auth.user.profile.email}
                  </Typography>
                )}
              </Box>
            </MenuItem>
            {userMenuItems.length > 0 && <MenuItem divider />}
            {userMenuItems.map((item, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  item.onClick();
                  handleUserMenuClose();
                }}
              >
                {item.icon && <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>{item.icon}</Box>}
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default GlobalHeader;


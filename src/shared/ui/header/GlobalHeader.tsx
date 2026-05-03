import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Box,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  HelpOutline as HelpIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../auth/src';
import { SearchModal } from '../../../features/search/src';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
  /**
   * Extra nodes in the right toolbar (e.g. language switcher)
   */
  extraActions?: ReactNode;
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
  searchPlaceholder,
  onCreateClick: _onCreateClick,
  createButtonText: _createButtonText,
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
  extraActions,
}) => {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('header.searchPlaceholder');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const closingRef = useRef(false);

  useEffect(() => {
    if (!searchModalOpen) {
      // Reset closing flag after modal is closed
      setTimeout(() => {
        closingRef.current = false;
      }, 100);
    }
  }, [searchModalOpen]);

  // Get user name from auth if not provided
  const displayUserName = userName || auth.user?.displayName || auth.user?.username || t('common.user');
  const displayUserInitials = displayUserName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSearchFocus = () => {
    if (closingRef.current) {
      return;
    }
    setSearchModalOpen(true);
  };

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if Escape was just pressed (to prevent reopening)
      if (e.key === 'Escape') {
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        e.stopPropagation();
        setSearchModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };


  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.85) 0%, rgba(79, 70, 229, 0.85) 100%)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        height: '64px',
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '0 4px 6px rgba(99, 102, 241, 0.15), 0 2px 4px rgba(99, 102, 241, 0.1)',
      }}
    >
      <Toolbar
        sx={{
          minHeight: '64px !important',
          height: '64px',
          paddingX: { xs: 2, sm: 4 },
          justifyContent: 'flex-start',
          gap: 2,
        }}
      >
        {/* Left Section - Logo/Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          {/* Sidebar Toggle */}
          {onSidebarToggle && (
            <Tooltip title={sidebarCollapsed ? t('header.expandSidebar') : t('header.collapseSidebar')} arrow placement="bottom">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="toggle sidebar"
                onClick={onSidebarToggle}
                size="small"
                sx={{
                  color: '#ffffff',
                  padding: '8px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    transform: 'scale(1.1) translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Logo */}
          {logo && <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>{logo}</Box>}

          {/* App Name - Brand */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              color: '#ffffff',
              fontSize: '18px',
              display: { xs: 'none', sm: 'block' },
              cursor: 'pointer',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                color: '#ffffff',
                transform: 'translateX(2px)',
                textShadow: '0 3px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
              },
              transition: 'all 0.2s ease',
            }}
            onClick={() => navigate('/')}
          >
            {appName}
          </Typography>
        </Box>

        {/* Center — global search (aligned to visual center of toolbar) */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Tooltip title={t('header.searchTooltip')} arrow placement="bottom">
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                if (closingRef.current) {
                  return;
                }
                setSearchModalOpen(true);
              }}
              onClick={() => {
                if (closingRef.current) {
                  return;
                }
                setSearchModalOpen(true);
              }}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '0 12px',
                height: '38px',
                width: '100%',
                maxWidth: 420,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                transition: 'all 0.2s ease',
                cursor: 'text',
                '&:hover': {
                  backgroundColor: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                  transform: 'translateY(-1px)',
                },
                '&:focus-within': {
                  backgroundColor: '#ffffff',
                  borderColor: '#ffffff',
                  boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.3), 0 6px 12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <SearchIcon sx={{ color: '#6366f1', fontSize: '18px', mr: 1, flexShrink: 0 }} />
              <InputBase
                placeholder={resolvedSearchPlaceholder}
                value={searchQuery}
                readOnly
                onFocus={handleSearchFocus}
                sx={{
                  flex: 1,
                  fontSize: '13px',
                  color: '#111827',
                  fontWeight: 500,
                  minWidth: 0,
                  cursor: 'text',
                  '& .MuiInputBase-input': {
                    padding: 0,
                    cursor: 'text',
                    '&::placeholder': {
                      color: '#9ca3af',
                      opacity: 1,
                      fontWeight: 400,
                    },
                  },
                }}
              />
            </Box>
          </Tooltip>
        </Box>

        {/* Right Section - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
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

          {extraActions}

          {/* Notifications */}
          {notificationComponent ? (
            notificationComponent
          ) : (
            onNotificationsClick && (
              <IconButton
                color="inherit"
                aria-label={t('header.notifications')}
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
            <Tooltip title={t('header.help')} arrow placement="bottom">
              <IconButton
                color="inherit"
                aria-label="help"
                onClick={onHelpClick}
                size="small"
                sx={{
                  color: '#ffffff',
                  padding: '8px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    transform: 'scale(1.1) translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <HelpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* Settings */}
          {onSettingsClick && (
            <Tooltip title="Settings & Preferences" arrow placement="bottom">
              <IconButton
                color="inherit"
                aria-label="settings"
                onClick={onSettingsClick}
                size="small"
                sx={{
                  color: '#ffffff',
                  padding: '8px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    transform: 'scale(1.1) translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {/* User Avatar */}
          <Tooltip title={t('header.accountMenu', { name: displayUserName })} arrow placement="bottom">
            <IconButton
              onClick={handleUserMenuOpen}
              size="small"
              sx={{
                padding: '4px',
                marginLeft: 0.5,
                '&:hover': { 
                  backgroundColor: 'transparent',
                },
                transition: 'all 0.15s ease',
              }}
            >
              <Avatar
                src={userAvatarUrl}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: '#ffffff',
                  color: '#6366f1',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                    transform: 'translateY(-1px) scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {!userAvatarUrl && displayUserInitials}
              </Avatar>
            </IconButton>
          </Tooltip>

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
                {auth.user?.email && (
                  <Typography variant="caption" color="text.secondary">
                    {auth.user.email}
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

      {/* Search Modal */}
      <SearchModal 
        open={searchModalOpen} 
        onClose={() => {
          closingRef.current = true;
          // Use setTimeout to prevent immediate reopening from event bubbling
          setTimeout(() => {
            setSearchModalOpen(false);
          }, 10);
        }} 
      />
    </AppBar>
  );
};

export default GlobalHeader;


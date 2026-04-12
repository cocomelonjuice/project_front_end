import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  Avatar,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  PersonAdd as PersonAddIcon,
  Comment as CommentIcon,
  SwapHoriz as SwapHorizIcon,
  AttachFile as AttachFileIcon,
  Edit as EditIcon,
  NotificationsNone as NotificationsNoneIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { notificationsActions, useSelectorNotifications } from '../store';
import { getNotificationIcon, getNotificationColor } from '../store/mockData';
import type { Notification } from '../store/states';

interface NotificationsDropdownProps {
  onNotificationClick?: (notification: Notification) => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  onNotificationClick,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notificationsState = useSelectorNotifications((state) => state);
  const { notifications, unreadCount, getNotificationsLoading, markAsReadLoading, markAllAsReadLoading } = notificationsState;
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    dispatch(
      notificationsActions.getNotificationsRequest({
        data: {},
        callback: {
          onSuccess: () => {},
          onError: () => {},
        },
      } as any),
    );
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      dispatch(
        notificationsActions.markAsReadRequest({
          data: { id: notification.id },
          callback: {
            onSuccess: () => {},
            onError: () => {},
          },
        } as any)
      );
    }
    
    // Navigate to issue if available
    if (notification.issueId && notification.issue?.projectId) {
      navigate(`/projects/${notification.issue.projectId}/issues/${notification.issueId}`);
    }
    
    // Call custom handler if provided
    onNotificationClick?.(notification);
    handleClose();
  };

  const handleMarkAllAsRead = () => {
    dispatch(
      notificationsActions.markAllAsReadRequest({
        data: {},
        callback: {
          onSuccess: () => {},
          onError: () => {},
        },
      } as any)
    );
  };

  const getNotificationIconComponent = (type: string) => {
    const iconName = getNotificationIcon(type);
    switch (iconName) {
      case 'person_add':
        return <PersonAddIcon />;
      case 'comment':
        return <CommentIcon />;
      case 'swap_horiz':
        return <SwapHorizIcon />;
      case 'attach_file':
        return <AttachFileIcon />;
      case 'edit':
        return <EditIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const formatTimestamp = useCallback(
    (timestamp: string): string => {
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          console.error('Invalid timestamp:', timestamp);
          return t('projectDetail.invalidDate');
        }

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const dateLocale = i18n.language?.startsWith('vi') ? 'vi-VN' : 'en-US';

        if (diffMs < 0) {
          return t('projectDetail.relativeJustNow');
        }

        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return t('projectDetail.relativeJustNow');
        if (diffMins < 60) return t('projectDetail.relativeMinutesAgo', { count: diffMins });
        if (diffHours < 24) return t('projectDetail.relativeHoursAgo', { count: diffHours });
        if (diffDays < 7) return t('projectDetail.relativeDaysAgo', { count: diffDays });

        return date.toLocaleDateString(dateLocale, {
          month: 'short',
          day: 'numeric',
          year: diffDays >= 365 ? 'numeric' : undefined,
        });
      } catch (error) {
        console.error('Error formatting timestamp:', error, timestamp);
        return t('projectDetail.invalidDate');
      }
    },
    [t, i18n.language],
  );

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ position: 'relative' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 400, maxHeight: 600, mt: 1.5 },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">{t('notificationsDropdown.title')}</Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                startIcon={<CheckCircleIcon />}
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadLoading}
              >
                {markAllAsReadLoading ? t('notificationsDropdown.marking') : t('notificationsDropdown.markAllRead')}
              </Button>
            )}
          </Box>
        </Box>
        <Divider />
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {getNotificationsLoading && notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <NotificationsNoneIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {t('notificationsDropdown.empty')}
              </Typography>
            </Box>
          ) : (
            notifications.map((notification, index) => {
              const iconColor = getNotificationColor(notification.type);
              return (
                <Box key={notification.id}>
                  <MenuItem
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                      py: 1.5,
                      px: 2,
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: iconColor,
                          color: 'white',
                        }}
                      >
                        {getNotificationIconComponent(notification.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: notification.isRead ? 400 : 600,
                            wordBreak: 'break-word',
                          }}
                        >
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', wordBreak: 'break-word' }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {formatTimestamp(notification.createdAt)}
                          </Typography>
                        </Box>
                      }
                    />
                    {!notification.isRead && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          ml: 1,
                        }}
                      />
                    )}
                  </MenuItem>
                  {index < notifications.length - 1 && <Divider />}
                </Box>
              );
            })
          )}
        </Box>
      </Menu>
    </>
  );
};

export default NotificationsDropdown;



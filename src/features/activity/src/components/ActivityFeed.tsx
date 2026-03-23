import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  AddCircle as CreateIcon,
  Edit as UpdateIcon,
  Delete as DeleteIcon,
  PersonAdd as AssignIcon,
  Comment as CommentIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import type { AuditLog } from '../store/states';
import { getActionIcon, getActionColor } from '../store/mockData';

interface ActivityFeedProps {
  auditLogs: AuditLog[];
  entityType?: string; // Filter by entity type
  entityId?: string; // Filter by entity ID
  emptyMessage?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  auditLogs,
  entityType,
  entityId,
  emptyMessage: emptyMessageProp,
}) => {
  const { t, i18n } = useTranslation();
  const emptyMessage = emptyMessageProp ?? t('projectDetail.activityFeedEmpty');
  const dateLocale = i18n.language?.startsWith('vi') ? 'vi-VN' : 'en-US';

  // Filter logs if filters are provided
  const filteredLogs = auditLogs.filter((log) => {
    if (entityType && log.entityType !== entityType) return false;
    if (entityId && log.entityId !== entityId) return false;
    return true;
  });

  const getActionIconComponent = (action: string) => {
    const iconName = getActionIcon(action);
    switch (iconName) {
      case 'add_circle':
        return <CreateIcon />;
      case 'edit':
        return <UpdateIcon />;
      case 'delete':
        return <DeleteIcon />;
      case 'person_add':
        return <AssignIcon />;
      case 'comment':
        return <CommentIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return t('projectDetail.invalidDate');
    }
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (filteredLogs.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {filteredLogs.map((log, index) => {
        const actionColor = getActionColor(log.action);
        const isLast = index === filteredLogs.length - 1;

        return (
          <Box key={log.id}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* Icon */}
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: actionColor,
                  color: 'white',
                }}
              >
                {getActionIconComponent(log.action)}
              </Avatar>

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {log.user?.displayName || t('projectDetail.unknownUser')}
                  </Typography>
                  <Chip
                    label={log.action}
                    size="small"
                    sx={{
                      bgcolor: actionColor,
                      color: 'white',
                      height: 20,
                      fontSize: '0.7rem',
                      textTransform: 'capitalize',
                    }}
                  />
                  <Chip
                    label={log.entityType}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      textTransform: 'capitalize',
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatTimestamp(log.createdAt)}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  {log.description || `${log.action} ${log.entityType}`}
                </Typography>
              </Box>
            </Box>
            {!isLast && <Divider sx={{ mb: 2 }} />}
          </Box>
        );
      })}
    </Box>
  );
};

export default ActivityFeed;

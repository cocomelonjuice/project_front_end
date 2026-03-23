import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as StartIcon,
  CheckCircle as CompleteIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import type { Sprint } from '../store/states';
import { getSprintStatusColor, isSprintActive } from '../store/mockData';

interface SprintListProps {
  sprints: Sprint[];
  onEdit?: (sprint: Sprint) => void;
  onDelete?: (sprint: Sprint) => void;
  onStart?: (sprint: Sprint) => void;
  onComplete?: (sprint: Sprint) => void;
  onViewIssues?: (sprint: Sprint) => void;
  emptyMessage?: string;
}

const SprintList: React.FC<SprintListProps> = ({
  sprints,
  onEdit,
  onDelete,
  onStart,
  onComplete,
  onViewIssues,
  emptyMessage: emptyMessageProp,
}) => {
  const { t, i18n } = useTranslation();
  const emptyMessage = emptyMessageProp ?? t('projectDetail.sprintListEmpty');
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [selectedSprint, setSelectedSprint] = React.useState<Sprint | null>(null);

  const dateLocale = i18n.language?.startsWith('vi') ? 'vi-VN' : 'en-US';

  const formatSprintDurationLabel = (startDate?: string, endDate?: string): string => {
    if (!startDate || !endDate) return t('projectDetail.sprintNotScheduled');
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return t('projectDetail.sprintDurationDays', { days });
  };

  const sprintStatusLabel = (status: Sprint['status']): string => {
    switch (status) {
      case 'planned':
        return t('projectDetail.sprintStatusPlanned');
      case 'active':
        return t('projectDetail.sprintStatusActive');
      case 'closed':
        return t('projectDetail.sprintStatusClosed');
      default:
        return status;
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, sprint: Sprint) => {
    setMenuAnchor(event.currentTarget);
    setSelectedSprint(sprint);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedSprint(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  if (sprints.length === 0) {
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
      {sprints.map((sprint) => {
        const statusColor = getSprintStatusColor(sprint.status);
        const canStart = sprint.status === 'planned';
        const canComplete = sprint.status === 'active';
        const isActive = isSprintActive(sprint);

        return (
          <Card
            key={sprint.id}
            sx={{
              mb: 2,
              border: isActive ? `2px solid ${statusColor}` : '1px solid',
              borderColor: isActive ? statusColor : 'divider',
              '&:hover': {
                boxShadow: 2,
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
                      {sprint.name}
                    </Typography>
                    <Chip
                      label={sprintStatusLabel(sprint.status)}
                      size="small"
                      sx={{
                        bgcolor: statusColor,
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  </Box>

                  {sprint.goal && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <FlagIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                        {sprint.goal}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {sprint.startDate && sprint.endDate
                          ? `${new Date(sprint.startDate).toLocaleDateString(dateLocale)} - ${new Date(sprint.endDate).toLocaleDateString(dateLocale)}`
                          : t('projectDetail.sprintNotScheduled')}
                      </Typography>
                    </Box>
                    {sprint.startDate && sprint.endDate && (
                      <>
                        <Typography variant="caption" color="text.secondary">
                          •
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatSprintDurationLabel(sprint.startDate, sprint.endDate)}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {canStart && onStart && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<StartIcon />}
                      onClick={() => onStart(sprint)}
                      color="primary"
                    >
                      {t('projectDetail.sprintStart')}
                    </Button>
                  )}
                  {canComplete && onComplete && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<CompleteIcon />}
                      onClick={() => onComplete(sprint)}
                      color="success"
                    >
                      {t('projectDetail.sprintComplete')}
                    </Button>
                  )}
                  {onViewIssues && (
                    <Button size="small" variant="text" onClick={() => onViewIssues(sprint)}>
                      {t('projectDetail.sprintViewIssues')}
                    </Button>
                  )}
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, sprint)}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        {selectedSprint && onEdit && (
          <MenuItem onClick={() => handleAction(() => onEdit(selectedSprint))}>
            <EditIcon sx={{ mr: 1, fontSize: 18 }} />
            {t('home.edit')}
          </MenuItem>
        )}
        {selectedSprint && selectedSprint.status === 'planned' && onStart && (
          <MenuItem onClick={() => handleAction(() => onStart(selectedSprint))}>
            <StartIcon sx={{ mr: 1, fontSize: 18 }} />
            {t('projectDetail.sprintMenuStartSprint')}
          </MenuItem>
        )}
        {selectedSprint && selectedSprint.status === 'active' && onComplete && (
          <MenuItem onClick={() => handleAction(() => onComplete(selectedSprint))}>
            <CompleteIcon sx={{ mr: 1, fontSize: 18 }} />
            {t('projectDetail.sprintMenuCompleteSprint')}
          </MenuItem>
        )}
        {selectedSprint && onDelete && (
          <>
            <Divider />
            <MenuItem
              onClick={() => handleAction(() => onDelete(selectedSprint))}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
              {t('home.delete')}
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default SprintList;

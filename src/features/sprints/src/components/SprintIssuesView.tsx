import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import type { Sprint } from '../store/states';
import type { Issue } from '../../../issues/src/store/states';
import { mockIssueTypes, mockPriorities, mockStatuses, mockUsers } from '../../../issues/src/store/mockData';

interface SprintIssuesViewProps {
  sprint: Sprint;
  issues: Issue[];
  onBack: () => void;
}

const SprintIssuesView: React.FC<SprintIssuesViewProps> = ({ sprint, issues, onBack }) => {
  const { t } = useTranslation();

  const getPriorityChipColor = (priorityInput?: { name?: string; color?: string }) => {
    const name = (priorityInput?.name || '').toLowerCase();
    if (name.includes('highest')) return '#991B1B';
    if (name.includes('high')) return '#DC2626';
    if (name.includes('low')) return '#16A34A';
    if (name.includes('medium')) return '#D97706';
    return priorityInput?.color || '#64748B';
  };

  const getStatusChipStyle = (statusInput?: { category?: string; name?: string; color?: string }) => {
    const category = (statusInput?.category || '').toLowerCase();
    if (category === 'todo') return { bg: '#DCE4EC', text: '#334155', border: '#BFCBDA' };
    if (category === 'inprogress') return { bg: '#DCEAFF', text: '#1D4ED8', border: '#B6CCF8' };
    if (category === 'done') return { bg: '#D3EEDB', text: '#166534', border: '#A7D7B5' };

    const name = (statusInput?.name || '').toLowerCase();
    if (name.includes('to do') || name.includes('todo')) return { bg: '#DCE4EC', text: '#334155', border: '#BFCBDA' };
    if (name.includes('progress')) return { bg: '#DCEAFF', text: '#1D4ED8', border: '#B6CCF8' };
    if (name.includes('done')) return { bg: '#D3EEDB', text: '#166534', border: '#A7D7B5' };
    return { bg: statusInput?.color || '#DCE4EC', text: '#334155', border: '#BFCBDA' };
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={onBack} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5">{sprint.name}</Typography>
          {sprint.goal && (
            <Typography variant="body2" color="text.secondary">
              {sprint.goal}
            </Typography>
          )}
        </Box>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('projectDetail.colKey')}</TableCell>
                <TableCell>{t('projectDetail.colSummary')}</TableCell>
                <TableCell>{t('projectDetail.colType')}</TableCell>
                <TableCell>{t('projectDetail.colPriority')}</TableCell>
                <TableCell>{t('projectDetail.colStatus')}</TableCell>
                <TableCell>{t('projectDetail.colAssignee')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('projectDetail.sprintIssuesEmpty')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                issues.map((issue) => {
                  const type = issue.type || mockIssueTypes.find((ty) => ty.id === issue.typeId);
                  const priority = issue.priority || mockPriorities.find((p) => p.id === issue.priorityId);
                  const status = issue.status || mockStatuses.find((s) => s.id === issue.statusId);
                  const assignee =
                    issue.assignee || (issue.assigneeId ? mockUsers.find((u) => u.id === issue.assigneeId) : null);

                  return (
                    <TableRow key={issue.id} hover>
                      <TableCell>{issue.key}</TableCell>
                      <TableCell>{issue.summary}</TableCell>
                      <TableCell>
                        {type && (
                          <Chip
                            label={type.name}
                            size="small"
                            sx={{
                              bgcolor: type.color || '#64748B',
                              color: 'white',
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {priority && (
                          <Chip
                            label={priority.name}
                            size="small"
                            sx={{
                              bgcolor: getPriorityChipColor(priority),
                              color: 'white',
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {status && (
                          <Chip
                            label={status.name}
                            size="small"
                            sx={(() => {
                              const statusStyle = getStatusChipStyle(status);
                              return {
                                bgcolor: statusStyle.bg,
                                color: statusStyle.text,
                                border: `1px solid ${statusStyle.border}`,
                              };
                            })()}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {assignee ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                              {assignee.displayName.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">{assignee.displayName}</Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {t('projectDetail.unassigned')}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SprintIssuesView;

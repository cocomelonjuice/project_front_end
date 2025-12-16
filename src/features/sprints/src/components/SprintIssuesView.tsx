import React from 'react';
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
import {
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import type { Sprint } from '../store/states';
import type { Issue } from '../../../issues/src/store/states';
import { mockIssueTypes, mockPriorities, mockStatuses, mockUsers } from '../../../issues/src/store/mockData';

interface SprintIssuesViewProps {
  sprint: Sprint;
  issues: Issue[];
  onBack: () => void;
}

const SprintIssuesView: React.FC<SprintIssuesViewProps> = ({
  sprint,
  issues,
  onBack,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={onBack} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5">
            {sprint.name}
          </Typography>
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
                <TableCell>Key</TableCell>
                <TableCell>Summary</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assignee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No issues in this sprint
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                issues.map((issue) => {
                  const type = issue.type || mockIssueTypes.find((t) => t.id === issue.typeId);
                  const priority = issue.priority || mockPriorities.find((p) => p.id === issue.priorityId);
                  const status = issue.status || mockStatuses.find((s) => s.id === issue.statusId);
                  const assignee = issue.assignee || (issue.assigneeId ? mockUsers.find((u) => u.id === issue.assigneeId) : null);

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
                              bgcolor: type.color || '#ccc',
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
                              bgcolor: priority.color || '#ccc',
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
                            sx={{
                              bgcolor: status.color || '#ccc',
                              color: 'white',
                            }}
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
                            Unassigned
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

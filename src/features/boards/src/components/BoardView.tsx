import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Avatar,
} from '@mui/material';
import type { Issue } from '../../../issues/src/store/states';
import type { BoardColumn } from '../store/states';
import { mockIssueTypes, mockPriorities, mockStatuses, mockUsers } from '../../../issues/src/store/mockData';

interface BoardViewProps {
  issues: Issue[];
  columns: BoardColumn[];
  onIssueMove?: (issueId: string, newStatusId: string) => void;
}

const BoardView: React.FC<BoardViewProps> = ({ issues, columns, onIssueMove }) => {
  const [draggedIssue, setDraggedIssue] = useState<Issue | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Group issues by status (column)
  const getIssuesForColumn = (column: BoardColumn): Issue[] => {
    const filtered = issues.filter((issue) => column.statusIds.includes(issue.statusId));
    return filtered;
  };

  // Debug: Log issues and columns on render
  React.useEffect(() => {
    console.log('🔵 BoardView render:', {
      totalIssues: issues.length,
      issues: issues.map((i) => ({ key: i.key, statusId: i.statusId })),
      totalColumns: columns.length,
      columns: columns.map((c) => ({ id: c.id, name: c.name, statusIds: c.statusIds })),
      issuesByColumn: columns.map((c) => ({
        columnId: c.id,
        columnName: c.name,
        issueCount: getIssuesForColumn(c).length,
      })),
    });
  }, [issues, columns]);

  const handleDragStart = (e: React.DragEvent, issue: Issue) => {
    setDraggedIssue(issue);
    e.dataTransfer.effectAllowed = 'move';
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIssue(null);
    setDragOverColumn(null);
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, column: BoardColumn) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (draggedIssue && onIssueMove) {
      // Move issue to first status in the column (or you could let user choose)
      const newStatusId = column.statusIds[0];
      if (newStatusId && draggedIssue.statusId !== newStatusId) {
        onIssueMove(draggedIssue.id, newStatusId);
      }
    }

    setDraggedIssue(null);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
      {columns.map((column) => {
        const columnIssues = getIssuesForColumn(column);
        const isDragOver = dragOverColumn === column.id;

        return (
          <Paper
            key={column.id}
            sx={{
              minWidth: 300,
              maxWidth: 300,
              p: 2,
              bgcolor: isDragOver ? 'action.hover' : 'background.paper',
              border: isDragOver ? '2px dashed' : '1px solid',
              borderColor: isDragOver ? 'primary.main' : 'divider',
              transition: 'all 0.2s',
            }}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column)}
          >
            {/* Column Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: column.color || '#ccc',
                  }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {column.name}
                </Typography>
              </Box>
              <Chip label={columnIssues.length} size="small" />
            </Box>

            {/* Issues in Column */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {columnIssues.length === 0 ? (
                <Box
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No issues
                  </Typography>
                </Box>
              ) : (
                columnIssues.map((issue) => {
                  const type = issue.type || mockIssueTypes.find((t) => t.id === issue.typeId);
                  const priority = issue.priority || mockPriorities.find((p) => p.id === issue.priorityId);
                  const assignee = issue.assignee || (issue.assigneeId ? mockUsers.find((u) => u.id === issue.assigneeId) : null);

                  return (
                    <Card
                      key={issue.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, issue)}
                      onDragEnd={handleDragEnd}
                      sx={{
                        cursor: 'grab',
                        '&:active': {
                          cursor: 'grabbing',
                        },
                        '&:hover': {
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                          <Chip
                            label={type?.name || 'Unknown'}
                            size="small"
                            sx={{
                              bgcolor: type?.color || '#ccc',
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                          <Chip
                            label={priority?.name || 'Unknown'}
                            size="small"
                            sx={{
                              bgcolor: priority?.color || '#ccc',
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            wordBreak: 'break-word',
                          }}
                        >
                          {issue.key}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1,
                            wordBreak: 'break-word',
                            color: 'text.secondary',
                          }}
                        >
                          {issue.summary}
                        </Typography>
                        {assignee && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                            <Avatar
                              sx={{
                                width: 20,
                                height: 20,
                                bgcolor: 'primary.main',
                                fontSize: '0.65rem',
                              }}
                            >
                              {assignee.displayName.charAt(0)}
                            </Avatar>
                            <Typography variant="caption" color="text.secondary">
                              {assignee.displayName}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default BoardView;

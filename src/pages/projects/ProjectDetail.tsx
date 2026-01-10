import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { CreateIssueModal, EditIssueModal, DeleteIssueDialog } from '../../features/issues/src';
import { useSelectorReferenceData } from '../../features/reference-data/src/store';
import type { Issue } from '../../features/issues/src/store/states';
import { BoardView, CreateBoardModal, EditBoardModal, DeleteBoardDialog } from '../../features/boards/src';
import type { Board, BoardColumn } from '../../features/boards/src/store/states';
import {
  SprintList,
  CreateSprintModal,
  EditSprintModal,
  DeleteSprintDialog,
  SprintIssuesView,
} from '../../features/sprints/src';
import { sprintsActions, useSelectorSprints } from '../../features/sprints/src/store';
import type { Sprint } from '../../features/sprints/src/store/states';
import { projectsActions, useSelectorProjects } from '../../features/projects/src/store';
import { boardsActions, useSelectorBoards } from '../../features/boards/src/store';
import { issuesActions, useSelectorIssues } from '../../features/issues/src/store';
import {
  TeamList,
  AssignRoleModal,
} from '../../features/team/src';
import { teamActions, useSelectorTeam } from '../../features/team/src/store';
import { usersActions, useSelectorUsers } from '../../features/users/src/store';
import type { ProjectTeamMember, Role } from '../../features/team/src/store/states';
import {
  ActivityFeed,
  ActivityFilter,
} from '../../features/activity/src';
import type { EntityTypeFilter } from '../../features/activity/src/components/ActivityFilter';
import { useSelectorAuth } from '../../features/auth/src/store';

const ProjectDetail: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelectorAuth((state) => state);
  const currentUser = authState.user;
  const sprintsState = useSelectorSprints((state) => state);
  const boardsState = useSelectorBoards((state) => state);
  const issuesState = useSelectorIssues((state) => state);
  const referenceDataState = useSelectorReferenceData((state) => state);
  const teamState = useSelectorTeam((state) => state);
  const usersState = useSelectorUsers((state) => state);

  // All project issues (for Issues tab)
  const allProjectIssues = issuesState.issues.filter((issue) => issue.projectId === projectId);

  // Generate board columns dynamically from statuses
  const boardColumns: BoardColumn[] = React.useMemo(() => {
    const statuses = referenceDataState.statuses;
    if (statuses.length === 0) return [];

    // Group statuses by category
    const todoStatuses = statuses.filter((s) => s.category === 'todo');
    const inProgressStatuses = statuses.filter((s) => s.category === 'inprogress');
    const doneStatuses = statuses.filter((s) => s.category === 'done');

    const columns: BoardColumn[] = [];

    if (todoStatuses.length > 0) {
      columns.push({
        id: 'todo',
        name: 'To Do',
        statusIds: todoStatuses.map((s) => s.id),
        color: '#42526E',
      });
    }

    if (inProgressStatuses.length > 0) {
      columns.push({
        id: 'inprogress',
        name: 'In Progress',
        statusIds: inProgressStatuses.map((s) => s.id),
        color: '#0052CC',
      });
    }

    if (doneStatuses.length > 0) {
      columns.push({
        id: 'done',
        name: 'Done',
        statusIds: doneStatuses.map((s) => s.id),
        color: '#36B37E',
      });
    }

    // If no categories match, create columns from all statuses
    if (columns.length === 0 && statuses.length > 0) {
      return statuses.map((status, index) => ({
        id: `column-${index}`,
        name: status.name,
        statusIds: [status.id],
        color: status.color || '#ccc',
      }));
    }

    return columns;
  }, [referenceDataState.statuses]);

  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Sprints state - using Redux
  const [createSprintModalOpen, setCreateSprintModalOpen] = useState(false);
  const [editSprintModalOpen, setEditSprintModalOpen] = useState(false);
  const [deleteSprintDialogOpen, setDeleteSprintDialogOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [viewSprintIssues, setViewSprintIssues] = useState<Sprint | null>(null);
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);

  // Filter sprints by current board to ensure we only use sprints for the selected board
  const sprints = React.useMemo(() => {
    if (!currentBoardId) return sprintsState.sprints;
    return sprintsState.sprints.filter((sprint) => sprint.boardId === currentBoardId);
  }, [sprintsState.sprints, currentBoardId]);
  const [createBoardModalOpen, setCreateBoardModalOpen] = useState(false);
  const [editBoardModalOpen, setEditBoardModalOpen] = useState(false);
  const [deleteBoardDialogOpen, setDeleteBoardDialogOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  // Board-specific issues (for Board View)
  // Show issues that belong to sprints in the current board, OR unassigned issues (backlog)
  // Unassigned issues show on all boards as they can be added to any sprint
  const boardIssues = React.useMemo(() => {
    // If no board is selected, show all project issues (including unassigned)
    if (!currentBoardId) {
      return allProjectIssues;
    }

    // Get sprint IDs for the current board
    const boardSprintIds = sprints
      .filter((sprint) => sprint.boardId === currentBoardId)
      .map((sprint) => sprint.id);

    // Show issues that:
    // 1. Belong to sprints in the current board, OR
    // 2. Are unassigned (no sprintId) - these are backlog issues available to all boards
    const filtered = allProjectIssues.filter(
      (issue) => !issue.sprintId || boardSprintIds.includes(issue.sprintId)
    );

    return filtered;
  }, [allProjectIssues, currentBoardId, sprints]);

  // Team state
  const [assignRoleModalOpen, setAssignRoleModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<ProjectTeamMember | null>(null);
  const [removeTeamMemberDialogOpen, setRemoveTeamMemberDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<ProjectTeamMember | null>(null);

  // Get team members from Redux state
  const teamMembers = teamState.teamMembers;

  // Activity state
  const [activityFilter, setActivityFilter] = useState<EntityTypeFilter>('all');

  // Fetch issues for the project using Redux
  useEffect(() => {
    if (!projectId) return;

    dispatch(
      issuesActions.getIssuesRequest({
        data: { projectId },
        callback: {
          onSuccess: () => {
            // Issues loaded successfully
          },
          onError: (error: any) => {
            console.error('Failed to fetch issues:', error);
          },
        },
      } as any)
    );
  }, [projectId, dispatch]);

  // Fetch boards for the project using Redux
  useEffect(() => {
    if (!projectId) return;

    dispatch(
      boardsActions.getBoardsByProjectRequest({
        data: { projectId },
        callback: {
          onSuccess: (boards: any[]) => {
            if (boards && boards.length > 0) {
              // Use the first board's UUID
              setCurrentBoardId(boards[0].id);
            } else {
              // No boards found for this project
              setCurrentBoardId(null);
            }
          },
          onError: (error: any) => {
            console.error('Failed to fetch boards:', error);
            setCurrentBoardId(null);
          },
        },
      } as any)
    );
  }, [projectId, dispatch]);

  // Load sprints for the current board
  useEffect(() => {
    if (currentBoardId) {
      dispatch(
        sprintsActions.getSprintsByBoardRequest({
          data: { boardId: currentBoardId },
          callback: {
            onSuccess: () => {
              // Sprints loaded successfully
            },
            onError: (error: any) => {
              console.error('Failed to load sprints:', error);
            },
          },
        } as any)
      );
    }
  }, [currentBoardId, dispatch]);

  // Fetch roles on mount
  useEffect(() => {
    dispatch(
      teamActions.getRolesRequest({
        callback: {
          onSuccess: () => {
            // Roles loaded successfully
          },
          onError: (error: any) => {
            console.error('Failed to fetch roles:', error);
          },
        },
      } as any)
    );
  }, [dispatch]);

  // Fetch users on mount
  useEffect(() => {
    dispatch(
      usersActions.getUsersRequest({
        callback: {
          onSuccess: () => {
            // Users loaded successfully
          },
          onError: (error: any) => {
            console.error('Failed to fetch users:', error);
          },
        },
      } as any)
    );
  }, [dispatch]);

  // Fetch team members for the project
  useEffect(() => {
    if (projectId) {
      dispatch(
        teamActions.getTeamMembersRequest({
          data: { projectId },
          callback: {
            onSuccess: () => {
              // Team members loaded successfully
            },
            onError: (error: any) => {
              console.error('Failed to fetch team members:', error);
            },
          },
        } as any)
      );
    }
  }, [projectId, dispatch]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, issue: Issue) => {
    setMenuAnchor(event.currentTarget);
    setSelectedIssue(issue);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedIssue(null);
  };

  const handleView = () => {
    handleMenuClose();
    if (selectedIssue && projectId) {
      navigate(`/projects/${projectId}/issues/${selectedIssue.id}`);
    }
  };

  const handleEdit = () => {
    handleMenuClose();
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleCreateIssue = () => {
    setCreateModalOpen(true);
  };

  const handleIssueCreated = (newIssue: Issue) => {
    // Issue is already added to Redux state by the saga
    // Optionally reload issues to ensure consistency
    if (projectId) {
      dispatch(
        issuesActions.getIssuesRequest({
          data: { projectId },
          callback: {},
        } as any)
      );
    }
  };

  const handleIssueUpdated = (updatedIssue: Issue) => {
    // Issue is already updated in Redux state by the saga
    // Optionally reload issues to ensure consistency
    if (projectId) {
      dispatch(
        issuesActions.getIssuesRequest({
          data: { projectId },
          callback: {},
        } as any)
      );
    }
  };

  const handleIssueDeleted = (issueId: string) => {
    // Issue is already removed from Redux state by the saga
    // Optionally reload issues to ensure consistency
    if (projectId) {
      dispatch(
        issuesActions.getIssuesRequest({
          data: { projectId },
          callback: {},
        } as any)
      );
    }
  };

  const handleIssueMove = (issueId: string, newStatusId: string) => {
    // Update issue status when moved on board using transition API
    dispatch(
      issuesActions.transitionIssueRequest({
        data: {
          id: issueId,
          statusId: newStatusId,
        },
        callback: {
          onSuccess: () => {
            // Issue status updated successfully
            // Reload issues to get updated data
            if (projectId) {
              dispatch(
                issuesActions.getIssuesRequest({
                  data: { projectId },
                  callback: {},
                } as any)
              );
            }
          },
          onError: (error: any) => {
            console.error('Failed to transition issue:', error);
          },
        },
      } as any)
    );
  };

  // Sprint handlers
  const handleSprintCreated = () => {
    // Sprint is already added to Redux state by the saga
    // Optionally reload sprints to ensure consistency
    if (currentBoardId) {
      dispatch(
        sprintsActions.getSprintsByBoardRequest({
          data: { boardId: currentBoardId },
          callback: {},
        } as any)
      );
    }
  };

  const handleSprintUpdated = () => {
    // Sprint is already updated in Redux state by the saga
    setSelectedSprint(null);
  };

  const handleSprintDeleted = () => {
    // Sprint is already removed from Redux state by the saga
    setSelectedSprint(null);
  };

  // Board handlers
  const handleBoardCreated = () => {
    // Reload boards to get the new board
    if (projectId) {
      dispatch(
        boardsActions.getBoardsByProjectRequest({
          data: { projectId },
          callback: {
            onSuccess: (boards: any[]) => {
              if (boards && boards.length > 0) {
                // Use the first board's UUID (or the newly created one)
                setCurrentBoardId(boards[0].id);
              }
            },
            onError: (error: any) => {
              console.error('Failed to reload boards:', error);
            },
          },
        } as any)
      );
    }
  };

  const handleBoardUpdated = () => {
    // Board is already updated in Redux state by the saga
    setSelectedBoard(null);
  };

  const handleBoardDeleted = () => {
    // Board is already removed from Redux state by the saga
    setSelectedBoard(null);
    setCurrentBoardId(null);
    // Reload boards to see if there are any remaining
    if (projectId) {
      dispatch(
        boardsActions.getBoardsByProjectRequest({
          data: { projectId },
          callback: {
            onSuccess: (boards: any[]) => {
              if (boards && boards.length > 0) {
                setCurrentBoardId(boards[0].id);
              } else {
                setCurrentBoardId(null);
              }
            },
            onError: (error: any) => {
              console.error('Failed to reload boards:', error);
            },
          },
        } as any)
      );
    }
  };

  const handleStartSprint = (sprint: Sprint) => {
    dispatch(
      sprintsActions.startSprintRequest({
        data: { id: sprint.id },
        callback: {
          onSuccess: () => {
            // Sprint started successfully
          },
          onError: (error: any) => {
            console.error('Failed to start sprint:', error);
          },
        },
      } as any)
    );
  };

  const handleCompleteSprint = (sprint: Sprint) => {
    dispatch(
      sprintsActions.completeSprintRequest({
        data: { id: sprint.id },
        callback: {
          onSuccess: () => {
            // Sprint completed successfully
          },
          onError: (error: any) => {
            console.error('Failed to complete sprint:', error);
          },
        },
      } as any)
    );
  };

  const handleViewSprintIssues = (sprint: Sprint) => {
    setViewSprintIssues(sprint);
  };

  const handleBackFromSprintIssues = () => {
    setViewSprintIssues(null);
  };

  // Team handlers
  const handleRoleAssigned = (userId: string, roleId: string) => {
    // Role assignment is handled by Redux
    // Refetch team members to show the newly added member
    if (projectId) {
      dispatch(
        teamActions.getTeamMembersRequest({
          data: { projectId },
          callback: {
            onSuccess: () => {
              // Team members refreshed
            },
            onError: (error: any) => {
              console.error('Failed to refresh team members:', error);
            },
          },
        } as any)
      );
    }
    setEditingTeamMember(null);
  };

  const handleEditTeamMember = (member: ProjectTeamMember) => {
    setEditingTeamMember(member);
    setAssignRoleModalOpen(true);
  };

  const handleRemoveTeamMember = (member: ProjectTeamMember) => {
    setMemberToRemove(member);
    setRemoveTeamMemberDialogOpen(true);
  };

  const handleConfirmRemoveTeamMember = () => {
    if (!projectId || !memberToRemove) return;

    dispatch(
      teamActions.removeRoleFromUserInProjectRequest({
        data: {
          projectId,
          roleId: memberToRemove.roleId,
          userId: memberToRemove.userId,
        },
        callback: {
          onSuccess: () => {
            // Refetch team members to update the list
            dispatch(
              teamActions.getTeamMembersRequest({
                data: { projectId },
                callback: {
                  onSuccess: () => {
                    // Team members refreshed
                  },
                  onError: (error: any) => {
                    console.error('Failed to refresh team members:', error);
                  },
                },
              } as any)
            );
            setRemoveTeamMemberDialogOpen(false);
            setMemberToRemove(null);
          },
          onError: (error: any) => {
            console.error('Failed to remove team member:', error);
          },
        },
      } as any)
    );
  };

  // Load project data from Redux store
  const projectsState = useSelectorProjects((state) => state);
  const project = projectsState.currentProject || projectsState.projects.find((p) => p.id === projectId) || null;

  useEffect(() => {
    if (projectId) {
      // Fetch project by ID if not already in store or if current project doesn't match
      if (!project || project.id !== projectId) {
        dispatch(
          projectsActions.getProjectByIdRequest({
            data: { id: projectId },
            callback: {
              onError: (error: any) => {
                console.error('Failed to fetch project:', error);
              },
            },
          } as any)
        );
      }
    }
  }, [projectId, dispatch, project]);

  if (!project) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading project...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/')} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                }}
              >
                {project.key.charAt(0)}
              </Box>
              <Typography variant="h4" component="h1">
                {project.name}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {project.description}
            </Typography>
          </Box>
        </Box>
      </Box>


      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Boards" />
          <Tab label="Issues" />
          <Tab label="Team" />
          <Tab label="Activity" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          {viewSprintIssues ? (
            <SprintIssuesView
              sprint={viewSprintIssues}
              issues={viewSprintIssues 
                ? allProjectIssues.filter((issue) => issue.sprintId === viewSprintIssues.id)
                : []}
              onBack={handleBackFromSprintIssues}
            />
          ) : (
            <>
              {/* Sprints Section */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6">Sprints</Typography>
                    {boardsState.boards.length > 1 ? (
                      <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Select Board</InputLabel>
                        <Select
                          value={currentBoardId || ''}
                          label="Select Board"
                          onChange={(e) => setCurrentBoardId(e.target.value)}
                        >
                          {boardsState.boards.map((board) => (
                            <MenuItem key={board.id} value={board.id}>
                              {board.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : boardsState.boards.length > 0 && currentBoardId ? (
                      <Chip
                        label={`Board: ${boardsState.boards.find((b) => b.id === currentBoardId)?.name || 'Unknown'}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ) : null}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {boardsState.boards.length > 0 && currentBoardId && (
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const board = boardsState.boards.find((b) => b.id === currentBoardId);
                            if (board) {
                              setSelectedBoard(board);
                              setEditBoardModalOpen(true);
                            }
                          }}
                        >
                          Edit Board
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            const board = boardsState.boards.find((b) => b.id === currentBoardId);
                            if (board) {
                              setSelectedBoard(board);
                              setDeleteBoardDialogOpen(true);
                            }
                          }}
                        >
                          Delete Board
                        </Button>
                      </>
                    )}
                    {currentBoardId && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateSprintModalOpen(true)}
                        size="small"
                        disabled={boardsState.getBoardsLoading}
                      >
                        Create Sprint
                      </Button>
                    )}
                    {!currentBoardId && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateBoardModalOpen(true)}
                        size="small"
                      >
                        Create Board
                      </Button>
                    )}
                  </Box>
                </Box>
                {boardsState.getBoardsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      Loading boards...
                    </Typography>
                  </Box>
                ) : !currentBoardId ? (
                  <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      No boards found for this project. Please create a board first to manage sprints.
                      {projectId && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Project ID: {projectId}
                        </Typography>
                      )}
                    </Alert>
                    <SprintList sprints={[]} emptyMessage="No sprints available (no board found)" />
                  </Box>
                ) : (
                  <SprintList
                    sprints={sprints}
                    onEdit={(sprint) => {
                      setSelectedSprint(sprint);
                      setEditSprintModalOpen(true);
                    }}
                    onDelete={(sprint) => {
                      setSelectedSprint(sprint);
                      setDeleteSprintDialogOpen(true);
                    }}
                    onStart={handleStartSprint}
                    onComplete={handleCompleteSprint}
                    onViewIssues={handleViewSprintIssues}
                  />
                )}
              </Paper>

              {/* Board Section */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6">Board View</Typography>
                    {boardsState.boards.length > 1 ? (
                      <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Select Board</InputLabel>
                        <Select
                          value={currentBoardId || ''}
                          label="Select Board"
                          onChange={(e) => setCurrentBoardId(e.target.value)}
                        >
                          {boardsState.boards.map((board) => (
                            <MenuItem key={board.id} value={board.id}>
                              {board.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : boardsState.boards.length > 0 && currentBoardId ? (
                      <Chip
                        label={boardsState.boards.find((b) => b.id === currentBoardId)?.name || 'Unknown'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ) : null}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {boardsState.boards.length > 0 && currentBoardId && (
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const board = boardsState.boards.find((b) => b.id === currentBoardId);
                            if (board) {
                              setSelectedBoard(board);
                              setEditBoardModalOpen(true);
                            }
                          }}
                        >
                          Edit Board
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            const board = boardsState.boards.find((b) => b.id === currentBoardId);
                            if (board) {
                              setSelectedBoard(board);
                              setDeleteBoardDialogOpen(true);
                            }
                          }}
                        >
                          Delete Board
                        </Button>
                      </>
                    )}
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleCreateIssue}
                      size="small"
                      disabled={!currentBoardId}
                    >
                      Create Issue
                    </Button>
                  </Box>
                </Box>
                <BoardView
                  issues={boardIssues}
                  columns={boardColumns}
                  onIssueMove={handleIssueMove}
                />
              </Box>
            </>
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Issues</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateIssue}
              size="small"
            >
              Create Issue
            </Button>
          </Box>

          {/* Always show table, don't wait for Redux loading */}
          <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Key</TableCell>
                    <TableCell>Summary</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assignee</TableCell>
                    <TableCell width={50}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allProjectIssues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No issues found. Create your first issue to get started.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    allProjectIssues.map((issue) => {
                      const type = issue.type || referenceDataState.issueTypes.find((t) => t.id === issue.typeId);
                      const priority = issue.priority || referenceDataState.priorities.find((p) => p.id === issue.priorityId);
                      const status = issue.status || referenceDataState.statuses.find((s) => s.id === issue.statusId);

                      return (
                        <TableRow key={issue.id} hover>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'primary.main',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                              }}
                              onClick={() => navigate(`/projects/${projectId}/issues/${issue.id}`)}
                            >
                              {issue.key}
                            </Typography>
                          </TableCell>
                          <TableCell>{issue.summary}</TableCell>
                          <TableCell>
                            <Chip
                              label={type?.name || 'Unknown'}
                              size="small"
                              sx={{
                                bgcolor: type?.color || '#ccc',
                                color: 'white',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={priority?.name || 'Unknown'}
                              size="small"
                              sx={{
                                bgcolor: priority?.color || '#ccc',
                                color: 'white',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={status?.name || 'Unknown'}
                              size="small"
                              sx={{
                                bgcolor: status?.color || '#ccc',
                                color: 'white',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {issue.assignee ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                                  {issue.assignee.displayName.charAt(0)}
                                </Avatar>
                                <Typography variant="body2">{issue.assignee.displayName}</Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Unassigned
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, issue)}>
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                            <Menu
                              anchorEl={menuAnchor}
                              open={Boolean(menuAnchor) && selectedIssue?.id === issue.id}
                              onClose={handleMenuClose}
                            >
                              <MenuItem onClick={handleView}>View</MenuItem>
                              <MenuItem onClick={handleEdit}>
                                <EditIcon sx={{ mr: 1, fontSize: 18 }} />
                                Edit
                              </MenuItem>
                              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                                <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
                                Delete
                              </MenuItem>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Team Members</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingTeamMember(null);
                  setAssignRoleModalOpen(true);
                }}
                size="small"
              >
                Add Member
              </Button>
            </Box>
            <TeamList
              teamMembers={teamMembers}
              onEdit={handleEditTeamMember}
              onRemove={handleRemoveTeamMember}
            />
          </Paper>
        </Box>
      )}

      {tabValue === 3 && (
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Activity
            </Typography>
            <ActivityFilter
              entityType={activityFilter}
              onEntityTypeChange={setActivityFilter}
            />
            <ActivityFeed
              auditLogs={[]}
              entityType={activityFilter === 'all' ? undefined : activityFilter}
              entityId={projectId}
              emptyMessage="No activity for this project"
            />
          </Paper>
        </Box>
      )}

      {/* Modals */}
      <CreateIssueModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        projectId={projectId || ''}
        reporterId={currentUser?.id || ''}
        onIssueCreated={handleIssueCreated}
      />
      {selectedIssue && (
        <>
          <EditIssueModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            issue={selectedIssue}
            onIssueUpdated={handleIssueUpdated}
          />
          <DeleteIssueDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            issue={selectedIssue}
            onIssueDeleted={handleIssueDeleted}
          />
        </>
      )}

      {/* Sprint Modals */}
      {currentBoardId && (
        <CreateSprintModal
          open={createSprintModalOpen}
          onClose={() => setCreateSprintModalOpen(false)}
          boardId={currentBoardId}
          onSprintCreated={handleSprintCreated}
        />
      )}
      {selectedSprint && (
        <>
          <EditSprintModal
            open={editSprintModalOpen}
            onClose={() => {
              setEditSprintModalOpen(false);
              setSelectedSprint(null);
            }}
            sprint={selectedSprint}
            onSprintUpdated={handleSprintUpdated}
          />
          <DeleteSprintDialog
            open={deleteSprintDialogOpen}
            onClose={() => {
              setDeleteSprintDialogOpen(false);
              setSelectedSprint(null);
            }}
            sprint={selectedSprint}
            onSprintDeleted={handleSprintDeleted}
          />
        </>
      )}

      {/* Board Modals */}
      {projectId && (
        <CreateBoardModal
          open={createBoardModalOpen}
          onClose={() => setCreateBoardModalOpen(false)}
          projectId={projectId}
          onBoardCreated={handleBoardCreated}
        />
      )}
      {selectedBoard && (
        <>
          <EditBoardModal
            open={editBoardModalOpen}
            onClose={() => {
              setEditBoardModalOpen(false);
              setSelectedBoard(null);
            }}
            board={selectedBoard}
            onBoardUpdated={handleBoardUpdated}
          />
          <DeleteBoardDialog
            open={deleteBoardDialogOpen}
            onClose={() => {
              setDeleteBoardDialogOpen(false);
              setSelectedBoard(null);
            }}
            board={selectedBoard}
            onBoardDeleted={handleBoardDeleted}
          />
        </>
      )}

      {/* Team Modals */}
      <AssignRoleModal
        open={assignRoleModalOpen}
        onClose={() => {
          setAssignRoleModalOpen(false);
          setEditingTeamMember(null);
        }}
        projectId={projectId || ''}
        availableUsers={usersState.users}
        availableRoles={teamState.roles}
        existingTeamMembers={teamMembers}
        editingMember={editingTeamMember}
        onRoleAssigned={handleRoleAssigned}
      />

      {/* Remove Team Member Dialog */}
      <Dialog open={removeTeamMemberDialogOpen} onClose={() => setRemoveTeamMemberDialogOpen(false)}>
        <DialogTitle>Remove Team Member</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove <strong>{memberToRemove?.user.displayName}</strong> ({memberToRemove?.role.name}) from this project team?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveTeamMemberDialogOpen(false)} disabled={teamState.removeRoleLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRemoveTeamMember}
            color="error"
            variant="contained"
            disabled={teamState.removeRoleLoading}
            startIcon={teamState.removeRoleLoading ? <CircularProgress size={16} /> : null}
          >
            {teamState.removeRoleLoading ? 'Removing...' : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetail;

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { CreateIssueModal, EditIssueModal, DeleteIssueDialog } from '../../features/issues/src';
import { mockIssueTypes, mockPriorities, mockStatuses, mockIssues, mockUsers } from '../../features/issues/src/store/mockData';
import type { Issue } from '../../features/issues/src/store/states';
import { BoardView } from '../../features/boards/src';
import { defaultBoardColumns, mockBoards } from '../../features/boards/src/store/mockData';
import {
  SprintList,
  CreateSprintModal,
  EditSprintModal,
  DeleteSprintDialog,
  SprintIssuesView,
} from '../../features/sprints/src';
import { mockSprints } from '../../features/sprints/src/store/mockData';
import type { Sprint } from '../../features/sprints/src/store/states';
import {
  TeamList,
  AssignRoleModal,
} from '../../features/team/src';
import { mockRoles, mockProjectTeamMembers } from '../../features/team/src/store/mockData';
import type { ProjectTeamMember, Role } from '../../features/team/src/store/states';
import {
  ActivityFeed,
  ActivityFilter,
} from '../../features/activity/src';
import { mockAuditLogs } from '../../features/activity/src/store/mockData';
import type { EntityTypeFilter } from '../../features/activity/src/components/ActivityFilter';

const ProjectDetail: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use local state for issues (simpler mock approach)
  // Initialize with mock data for the current project
  const initializedRef = useRef(false);
  const [localIssues, setLocalIssues] = useState<Issue[]>(() => {
    // Initialize with mock issues for projectId '1' or current projectId
    const initialIssues = projectId 
      ? mockIssues.filter((issue) => issue.projectId === projectId || issue.projectId === '1')
      : [];
    console.log('🔵 Initial localIssues:', initialIssues.length);
    return initialIssues;
  });
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Sprints state
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [createSprintModalOpen, setCreateSprintModalOpen] = useState(false);
  const [editSprintModalOpen, setEditSprintModalOpen] = useState(false);
  const [deleteSprintDialogOpen, setDeleteSprintDialogOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [viewSprintIssues, setViewSprintIssues] = useState<Sprint | null>(null);

  // Team state
  const [teamMembers, setTeamMembers] = useState<ProjectTeamMember[]>([]);
  const [assignRoleModalOpen, setAssignRoleModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<ProjectTeamMember | null>(null);

  // Activity state
  const [activityFilter, setActivityFilter] = useState<EntityTypeFilter>('all');

  // Initialize with mock data when component mounts or projectId changes (only once per projectId)
  useEffect(() => {
    if (projectId && !initializedRef.current) {
      // Load mock issues for this project only on first load
      const projectIssues = mockIssues.filter((issue) => issue.projectId === projectId || issue.projectId === '1');
      console.log('🔵 Loading initial mock issues for project:', projectId, 'count:', projectIssues.length);
      setLocalIssues(projectIssues);
      initializedRef.current = true;
    } else if (projectId && initializedRef.current) {
      // Reset ref when projectId changes
      initializedRef.current = false;
    }
  }, [projectId]); // Only run when projectId changes

  // Load sprints for the default board (boardId '1')
  useEffect(() => {
    // For now, use boardId '1' as default
    // In real app, this would be based on the selected board
    const boardId = '1';
    const boardSprints = mockSprints.filter((s) => s.boardId === boardId);
    setSprints(boardSprints);
  }, [projectId]);

  // Load team members for the project
  useEffect(() => {
    // For now, use projectId '1' as default
    // In real app, this would fetch from API
    const projectTeam = mockProjectTeamMembers.filter((m) => true); // All members for now
    setTeamMembers(projectTeam);
  }, [projectId]);

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
    console.log('🔵 handleIssueCreated called with:', newIssue);
    console.log('🔵 Current localIssues before update:', localIssues.length);
    // Add new issue to local state immediately
    setLocalIssues((prev) => {
      const updated = [newIssue, ...prev];
      console.log('🔵 Updated issues count:', updated.length);
      console.log('🔵 New issue added:', newIssue.key, newIssue.summary);
      return updated;
    });
  };

  const handleIssueUpdated = (updatedIssue: Issue) => {
    // Update issue in local state
    setLocalIssues((prev) =>
      prev.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue))
    );
  };

  const handleIssueDeleted = (issueId: string) => {
    // Remove issue from local state
    setLocalIssues((prev) => prev.filter((issue) => issue.id !== issueId));
  };

  const handleIssueMove = (issueId: string, newStatusId: string) => {
    // Update issue status when moved on board
    setLocalIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const newStatus = mockStatuses.find((s) => s.id === newStatusId);
          return {
            ...issue,
            statusId: newStatusId,
            status: newStatus,
          };
        }
        return issue;
      })
    );
  };

  // Sprint handlers
  const handleSprintCreated = (newSprint: Sprint) => {
    setSprints((prev) => [...prev, newSprint]);
  };

  const handleSprintUpdated = (updatedSprint: Sprint) => {
    setSprints((prev) => prev.map((s) => (s.id === updatedSprint.id ? updatedSprint : s)));
    setSelectedSprint(null);
  };

  const handleSprintDeleted = (sprintId: string) => {
    setSprints((prev) => prev.filter((s) => s.id !== sprintId));
    setSelectedSprint(null);
  };

  const handleStartSprint = (sprint: Sprint) => {
    const updatedSprint: Sprint = {
      ...sprint,
      status: 'active',
      startDate: new Date().toISOString(),
    };
    handleSprintUpdated(updatedSprint);
  };

  const handleCompleteSprint = (sprint: Sprint) => {
    const updatedSprint: Sprint = {
      ...sprint,
      status: 'closed',
      endDate: new Date().toISOString(),
    };
    handleSprintUpdated(updatedSprint);
  };

  const handleViewSprintIssues = (sprint: Sprint) => {
    setViewSprintIssues(sprint);
  };

  const handleBackFromSprintIssues = () => {
    setViewSprintIssues(null);
  };

  // Team handlers
  const handleRoleAssigned = (userId: string, roleId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    const role = mockRoles.find((r) => r.id === roleId);
    
    if (!user || !role) return;

    if (editingTeamMember) {
      // Update existing member
      setTeamMembers((prev) =>
        prev.map((m) =>
          m.userId === userId
            ? { ...m, roleId, role }
            : m
        )
      );
      setEditingTeamMember(null);
    } else {
      // Add new member
      const newMember: ProjectTeamMember = {
        userId,
        user,
        roleId,
        role,
      };
      setTeamMembers((prev) => [...prev, newMember]);
    }
  };

  const handleEditTeamMember = (member: ProjectTeamMember) => {
    setEditingTeamMember(member);
    setAssignRoleModalOpen(true);
  };

  const handleRemoveTeamMember = (member: ProjectTeamMember) => {
    setTeamMembers((prev) => prev.filter((m) => m.userId !== member.userId));
  };

  // Load project data (for now using mock, later from projects store)
  // In a real app, this would fetch from API using projectId
  const [project, setProject] = useState<{
    id: string;
    key: string;
    name: string;
    type: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    if (projectId) {
      // TODO: Load project from API/store using projectId
      // For now, we'll use mock data based on projectId
      // In real implementation: fetch project by ID from projects store/API
      const mockProjects = [
        {
          id: '1',
          key: 'PROJ',
          name: 'Sample Project',
          type: 'software',
          description: 'A sample project for testing',
        },
        {
          id: '2',
          key: 'DEV',
          name: 'Development Project',
          type: 'business',
          description: 'Development team project',
        },
        {
          id: '3',
          key: 'TEST',
          name: 'Test Project',
          type: 'software',
          description: 'Testing project',
        },
      ];
      const foundProject = mockProjects.find((p) => p.id === projectId) || mockProjects[0];
      setProject(foundProject);
    }
  }, [projectId]);

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
              issues={localIssues} // For mock data, show all issues. In real app, filter by sprintId
              onBack={handleBackFromSprintIssues}
            />
          ) : (
            <>
              {/* Sprints Section */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Sprints</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateSprintModalOpen(true)}
                    size="small"
                  >
                    Create Sprint
                  </Button>
                </Box>
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
              </Paper>

              {/* Board Section */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Board</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateIssue}
                    size="small"
                  >
                    Create Issue
                  </Button>
                </Box>
                <BoardView
                  issues={localIssues}
                  columns={defaultBoardColumns}
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
                  {localIssues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No issues found. Create your first issue to get started.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    localIssues.map((issue) => {
                      const type = issue.type || mockIssueTypes.find((t) => t.id === issue.typeId);
                      const priority = issue.priority || mockPriorities.find((p) => p.id === issue.priorityId);
                      const status = issue.status || mockStatuses.find((s) => s.id === issue.statusId);

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
              auditLogs={mockAuditLogs}
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
        reporterId="1"
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
      <CreateSprintModal
        open={createSprintModalOpen}
        onClose={() => setCreateSprintModalOpen(false)}
        boardId="1" // Default board ID, in real app this would be from selected board
        onSprintCreated={handleSprintCreated}
      />
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

      {/* Team Modals */}
      <AssignRoleModal
        open={assignRoleModalOpen}
        onClose={() => {
          setAssignRoleModalOpen(false);
          setEditingTeamMember(null);
        }}
        projectId={projectId || ''}
        availableUsers={mockUsers}
        availableRoles={mockRoles}
        existingTeamMembers={teamMembers}
        editingMember={editingTeamMember}
        onRoleAssigned={handleRoleAssigned}
      />
    </Box>
  );
};

export default ProjectDetail;

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  CreateWorkflowModal,
  EditWorkflowModal,
  DeleteWorkflowDialog,
  workflowsActions,
  useSelectorWorkflows,
} from '../../features/workflows/src';
import type { Workflow } from '../../features/workflows/src/store/states';
import { useSelectorProjects } from '../../features/projects/src/store';

const WorkflowsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projectsState = useSelectorProjects((state) => state);
  const workflowsState = useSelectorWorkflows((state) => state);
  const workflows = workflowsState.workflows;
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch workflows on mount
    dispatch(
      workflowsActions.getWorkflowsRequest({
        data: {},
        callback: {
          onSuccess: () => {
            // Workflows loaded successfully, they're in Redux state
          },
          onError: (error: any) => {
            console.error('Failed to load workflows:', error);
          },
        },
      } as any)
    );
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, workflow: Workflow) => {
    setMenuAnchor(event.currentTarget);
    setSelectedWorkflow(workflow);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedWorkflow(null);
  };

  const handleView = (workflow: Workflow) => {
    navigate(`/workflows/${workflow.id}`);
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedWorkflow) {
      setEditModalOpen(true);
      handleMenuClose();
    }
  };

  const handleDelete = () => {
    if (selectedWorkflow) {
      setDeleteDialogOpen(true);
      handleMenuClose();
    }
  };

  const handleWorkflowCreated = (workflow: Workflow) => {
    // Workflow is already added to Redux state by the saga
    // Optionally refresh the list
    dispatch(
      workflowsActions.getWorkflowsRequest({
        data: {},
        callback: {},
      } as any)
    );
  };

  const handleWorkflowUpdated = (updatedWorkflow: Workflow) => {
    // Workflow is already updated in Redux state by the saga
    // Optionally refresh the list
    dispatch(
      workflowsActions.getWorkflowsRequest({
        data: {},
        callback: {},
      } as any)
    );
  };

  const handleWorkflowDeleted = (workflowId: string) => {
    // Workflow is already removed from Redux state by the saga
  };

  const getProjectName = (projectId: string | null | undefined): string => {
    if (!projectId) {
      return 'Global';
    }
    const project = projectsState.projects.find((p) => p.id === projectId);
    return project ? project.name : 'Unknown';
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Workflows
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create Workflow
        </Button>
      </Box>

      {workflowsState.getWorkflowsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : workflows.length === 0 ? (
        <Alert severity="info">No workflows found. Create your first workflow to get started.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Transitions</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id} hover>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {workflow.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {workflow.description || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getProjectName(workflow.projectId)}
                      size="small"
                      color={workflow.projectId ? 'primary' : 'default'}
                      variant={workflow.projectId ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={workflow.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={workflow.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {workflow.transitions?.length || 0} transition(s)
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, workflow)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedWorkflow && handleView(selectedWorkflow)}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Modals */}
      <CreateWorkflowModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onWorkflowCreated={handleWorkflowCreated}
      />
      <EditWorkflowModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        workflow={selectedWorkflow}
        onWorkflowUpdated={handleWorkflowUpdated}
      />
      <DeleteWorkflowDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        workflow={selectedWorkflow}
        onWorkflowDeleted={handleWorkflowDeleted}
      />
    </Box>
  );
};

export default WorkflowsList;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  IconButton,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import {
  EditWorkflowModal,
  DeleteWorkflowDialog,
  AddTransitionModal,
  workflowsActions,
  useSelectorWorkflows,
} from '../../features/workflows/src';
import type { Workflow, WorkflowTransition } from '../../features/workflows/src/store/states';
import { useSelectorProjects } from '../../features/projects/src/store';

const WorkflowDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projectsState = useSelectorProjects((state) => state);
  const workflowsState = useSelectorWorkflows((state) => state);
  const workflow = workflowsState.currentWorkflow;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addTransitionModalOpen, setAddTransitionModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      // Fetch workflow from API
      dispatch(
        workflowsActions.getWorkflowByIdRequest({
          data: { id },
          callback: {
            onSuccess: (loadedWorkflow: Workflow) => {
              // Workflow loaded successfully, it's in Redux state as currentWorkflow
              // Verify the workflow ID matches
              if (loadedWorkflow.id !== id) {
                console.warn('Workflow ID mismatch:', { expected: id, received: loadedWorkflow.id });
              }
            },
            onError: (error: any) => {
              console.error('Failed to load workflow:', error);
            },
          },
        } as any)
      );
    }
  }, [id, dispatch]);

  const handleWorkflowUpdated = (updatedWorkflow: Workflow) => {
    // Workflow is already updated in Redux state by the saga
    // Refresh to get the latest data with transitions
    if (id) {
      dispatch(
        workflowsActions.getWorkflowByIdRequest({
          data: { id },
          callback: {},
        } as any)
      );
    }
  };

  const handleWorkflowDeleted = () => {
    navigate('/workflows');
  };

  const handleTransitionAdded = (transition: WorkflowTransition) => {
    // Transition is already added to Redux state by the saga
    // Refresh to get the latest workflow data
    if (id) {
      dispatch(
        workflowsActions.getWorkflowByIdRequest({
          data: { id },
          callback: {},
        } as any)
      );
    }
  };

  const handleTransitionDeleted = (transitionId: string) => {
    if (id) {
      dispatch(
        workflowsActions.deleteTransitionRequest({
          data: { workflowId: id, transitionId },
          callback: {
            onSuccess: () => {
              // Transition deleted successfully, it's already removed from Redux state
              // Optionally refresh to get latest workflow data
              dispatch(
                workflowsActions.getWorkflowByIdRequest({
                  data: { id },
                  callback: {},
                } as any)
              );
            },
            onError: (error: any) => {
              console.error('Failed to delete transition:', error);
              alert('Failed to delete transition. Please try again.');
            },
          },
        } as any)
      );
    }
  };

  const getProjectName = (projectId: string | null | undefined): string => {
    if (!projectId) {
      return 'Global (All Projects)';
    }
    const project = projectsState.projects.find((p) => p.id === projectId);
    return project ? project.name : 'Unknown';
  };

  if (workflowsState.getWorkflowLoading && !workflow) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!workflowsState.getWorkflowLoading && !workflow) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Workflow not found</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/workflows')}>
          Back to Workflows
        </Button>
      </Box>
    );
  }

  if (!workflow) {
    return null; // Still loading or workflow not yet available
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => navigate('/workflows')}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1">
            {workflow.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {workflow.description || 'No description'}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => setEditModalOpen(true)}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Transitions</Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setAddTransitionModalOpen(true)}
                >
                  Add Transition
                </Button>
              </Box>

              {!workflow.transitions || workflow.transitions.length === 0 ? (
                <Alert severity="info">
                  No transitions defined. Add transitions to define valid status changes.
                </Alert>
              ) : (
                <List>
                  {workflow.transitions.map((transition, index) => (
                    <React.Fragment key={transition.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Chip
                                label={transition.fromStatus?.name || 'Unknown'}
                                size="small"
                                sx={{
                                  bgcolor: transition.fromStatus?.color || '#ccc',
                                  color: 'white',
                                }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                →
                              </Typography>
                              <Chip
                                label={transition.toStatus?.name || 'Unknown'}
                                size="small"
                                sx={{
                                  bgcolor: transition.toStatus?.color || '#ccc',
                                  color: 'white',
                                }}
                              />
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            size="small"
                            color="error"
                            onClick={() => handleTransitionDeleted(transition.id)}
                            disabled={workflowsState.deleteTransitionLoading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < workflow.transitions!.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Project
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {getProjectName(workflow.projectId)}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Status
              </Typography>
              <Chip
                label={workflow.isActive ? 'Active' : 'Inactive'}
                size="small"
                color={workflow.isActive ? 'success' : 'default'}
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Transitions Count
              </Typography>
              <Typography variant="body1">
                {workflow.transitions?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modals */}
      <EditWorkflowModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        workflow={workflow}
        onWorkflowUpdated={handleWorkflowUpdated}
      />
      <DeleteWorkflowDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        workflow={workflow}
        onWorkflowDeleted={handleWorkflowDeleted}
      />
      <AddTransitionModal
        open={addTransitionModalOpen}
        onClose={() => setAddTransitionModalOpen(false)}
        workflowId={workflow.id}
        existingTransitions={workflow.transitions}
        onTransitionAdded={handleTransitionAdded}
      />
    </Box>
  );
};

export default WorkflowDetail;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '../../features/workflows/src';
import { mockWorkflows } from '../../features/workflows/src/store/mockData';
import type { Workflow, WorkflowTransition } from '../../features/workflows/src/store/states';
import { mockProjects } from '../../features/projects/src';

const WorkflowDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addTransitionModalOpen, setAddTransitionModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      // Simulate API call
      setTimeout(() => {
        const foundWorkflow = mockWorkflows.find((w) => w.id === id);
        setWorkflow(foundWorkflow || null);
        setLoading(false);
      }, 300);
    }
  }, [id]);

  const handleWorkflowUpdated = (updatedWorkflow: Workflow) => {
    setWorkflow(updatedWorkflow);
  };

  const handleWorkflowDeleted = () => {
    navigate('/workflows');
  };

  const handleTransitionAdded = (transition: WorkflowTransition) => {
    if (workflow) {
      setWorkflow({
        ...workflow,
        transitions: [...(workflow.transitions || []), transition],
      });
    }
  };

  const handleTransitionDeleted = (transitionId: string) => {
    if (workflow) {
      setWorkflow({
        ...workflow,
        transitions: workflow.transitions?.filter((t) => t.id !== transitionId) || [],
      });
    }
  };

  const getProjectName = (projectId: string | null | undefined): string => {
    if (!projectId) {
      return 'Global (All Projects)';
    }
    const project = mockProjects.find((p) => p.id === projectId);
    return project ? project.name : 'Unknown';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!workflow) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Workflow not found</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/workflows')}>
          Back to Workflows
        </Button>
      </Box>
    );
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

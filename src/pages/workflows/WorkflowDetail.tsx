import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
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
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_BUTTON_STYLES } from '../../shared/constants/src/ui';

const WorkflowDetail: React.FC = () => {
  const { t } = useTranslation();
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
              // Verify the workflow ID matches (silently handle mismatch)
              if (loadedWorkflow.id !== id) {
                // Workflow ID mismatch - this should not happen in normal flow
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
      return t('workflowDetail.globalAllProjects');
    }
    const project = projectsState.projects.find((p) => p.id === projectId);
    return project ? project.name : t('workflowDetail.unknown');
  };

  if (workflowsState.getWorkflowLoading && !workflow) {
    return (
      <Box sx={{ py: 4, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress sx={{ color: UI_COLORS.primary.main }} />
        </Box>
      </Box>
    );
  }

  if (!workflowsState.getWorkflowLoading && !workflow) {
    return (
      <Box sx={{ py: 4, width: '100%' }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: UI_BORDER_RADIUS.md,
            boxShadow: UI_SHADOWS.sm,
            mb: 2,
          }}
        >
          Workflow not found
        </Alert>
        <Button
          sx={{
            ...UI_BUTTON_STYLES.secondary,
            borderRadius: UI_BORDER_RADIUS.md,
            textTransform: 'none',
            fontSize: UI_TYPOGRAPHY.fontSize.base,
            fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
            mt: 2,
          }}
          onClick={() => navigate('/workflows')}
        >
          {t('workflowDetail.backToList')}
        </Button>
      </Box>
    );
  }

  if (!workflow) {
    return null; // Still loading or workflow not yet available
  }

  return (
    <Box sx={{ py: 4, width: '100%' }}>
      {/* Header */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: UI_BORDER_RADIUS.xl,
          boxShadow: UI_SHADOWS.lg,
          background: `linear-gradient(135deg, ${UI_COLORS.background.paper} 0%, ${UI_COLORS.background.subtle} 100%)`,
          border: `1px solid ${UI_COLORS.border.light}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, flex: 1, minWidth: 0 }}>
            <IconButton
              onClick={() => navigate('/workflows')}
              size="medium"
              sx={{
                color: UI_COLORS.text.secondary,
                mt: 0.5,
                border: `1px solid ${UI_COLORS.border.light}`,
                '&:hover': {
                  backgroundColor: UI_COLORS.primary.main,
                  color: UI_COLORS.primary.contrast,
                  borderColor: UI_COLORS.primary.main,
                  transform: 'translateY(-2px)',
                  boxShadow: UI_SHADOWS.md,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
                    color: UI_COLORS.text.primary,
                    fontSize: { xs: UI_TYPOGRAPHY.fontSize.xl, md: UI_TYPOGRAPHY.fontSize['2xl'] },
                    wordBreak: 'break-word',
                    lineHeight: 1.2,
                  }}
                >
                  {workflow.name}
                </Typography>
                <Chip
                  label={workflow.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  color={workflow.isActive ? 'success' : 'default'}
                  sx={{
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    fontSize: UI_TYPOGRAPHY.fontSize.xs,
                    height: 24,
                    boxShadow: UI_SHADOWS.sm,
                  }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: UI_COLORS.text.secondary,
                  fontSize: UI_TYPOGRAPHY.fontSize.lg,
                  wordBreak: 'break-word',
                  lineHeight: 1.6,
                  fontWeight: UI_TYPOGRAPHY.fontWeight.normal,
                }}
              >
                {workflow.description || t('workflowDetail.noDescription')}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditModalOpen(true)}
              sx={{
                ...UI_BUTTON_STYLES.secondary,
                borderRadius: UI_BORDER_RADIUS.md,
                textTransform: 'none',
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
                fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                px: 2.5,
                py: 1,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: UI_SHADOWS.md,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{
                borderRadius: UI_BORDER_RADIUS.md,
                textTransform: 'none',
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
                fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                borderColor: UI_COLORS.error.main,
                color: UI_COLORS.error.main,
                px: 2.5,
                py: 1,
                borderWidth: 2,
                '&:hover': {
                  borderColor: UI_COLORS.error.dark,
                  backgroundColor: UI_COLORS.error.bg,
                  transform: 'translateY(-2px)',
                  boxShadow: UI_SHADOWS.md,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {t('workflowDetail.delete')}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>
        {/* Main Content */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 66.67%', lg: '1 1 80%' }, minWidth: 0 }}>
          <Card
            sx={{
              mb: 3,
              borderRadius: UI_BORDER_RADIUS.xl,
              boxShadow: UI_SHADOWS.lg,
              backgroundColor: UI_COLORS.background.paper,
              border: `1px solid ${UI_COLORS.border.light}`,
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: UI_SHADOWS.xl,
              },
            }}
          >
            <CardContent sx={{ p: 4.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                  pb: 2,
                  borderBottom: `2px solid ${UI_COLORS.border.light}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      borderRadius: UI_BORDER_RADIUS.full,
                      bgcolor: UI_COLORS.primary.main,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                      color: UI_COLORS.text.primary,
                      fontSize: UI_TYPOGRAPHY.fontSize.xl,
                    }}
                  >
                    Transitions
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setAddTransitionModalOpen(true)}
                  sx={{
                    ...UI_BUTTON_STYLES.primary,
                    borderRadius: UI_BORDER_RADIUS.md,
                    textTransform: 'none',
                    fontSize: UI_TYPOGRAPHY.fontSize.sm,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                    px: 2.5,
                    py: 1,
                    boxShadow: UI_SHADOWS.md,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: UI_SHADOWS.lg,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {t('workflowDetail.addTransition')}
                </Button>
              </Box>

              {!workflow.transitions || workflow.transitions.length === 0 ? (
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: UI_BORDER_RADIUS.md,
                    backgroundColor: UI_COLORS.info.bg,
                    border: `1px solid ${UI_COLORS.info.light}`,
                  }}
                >
                  No transitions defined. Add transitions to define valid status changes.
                </Alert>
              ) : (
                <List sx={{ py: 0 }}>
                  {workflow.transitions.map((transition, index) => (
                    <React.Fragment key={transition.id}>
                      <ListItem
                        sx={{
                          py: 2,
                          px: 2,
                          mb: 1,
                          borderRadius: UI_BORDER_RADIUS.md,
                          border: `1px solid ${UI_COLORS.border.light}`,
                          backgroundColor: UI_COLORS.background.subtle,
                          '&:hover': {
                            backgroundColor: UI_COLORS.background.hover,
                            borderColor: UI_COLORS.primary.light,
                            transform: 'translateX(4px)',
                            boxShadow: UI_SHADOWS.sm,
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                              <Chip
                                label={transition.fromStatus?.name || t('workflowDetail.unknownStatus')}
                                size="medium"
                                sx={{
                                  bgcolor: transition.fromStatus?.color || UI_COLORS.text.secondary,
                                  color: 'white',
                                  fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                                  height: 32,
                                  boxShadow: UI_SHADOWS.sm,
                                }}
                              />
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 32,
                                  height: 32,
                                  borderRadius: UI_BORDER_RADIUS.full,
                                  bgcolor: UI_COLORS.primary.light,
                                  color: UI_COLORS.primary.contrast,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
                                    fontSize: UI_TYPOGRAPHY.fontSize.lg,
                                  }}
                                >
                                  →
                                </Typography>
                              </Box>
                              <Chip
                                label={transition.toStatus?.name || 'Unknown'}
                                size="medium"
                                sx={{
                                  bgcolor: transition.toStatus?.color || UI_COLORS.text.secondary,
                                  color: 'white',
                                  fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                                  height: 32,
                                  boxShadow: UI_SHADOWS.sm,
                                }}
                              />
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            size="medium"
                            onClick={() => handleTransitionDeleted(transition.id)}
                            disabled={workflowsState.deleteTransitionLoading}
                            sx={{
                              color: UI_COLORS.error.main,
                              border: `1px solid ${UI_COLORS.border.light}`,
                              '&:hover': {
                                backgroundColor: UI_COLORS.error.main,
                                color: 'white',
                                borderColor: UI_COLORS.error.main,
                                transform: 'scale(1.1)',
                                boxShadow: UI_SHADOWS.md,
                              },
                              transition: 'all 0.2s ease-in-out',
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < workflow.transitions!.length - 1 && (
                        <Box sx={{ height: 8 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Sidebar */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.33%', lg: '1 1 20%' }, minWidth: 0 }}>
          <Card
            sx={{
              mb: 3,
              borderRadius: UI_BORDER_RADIUS.xl,
              boxShadow: UI_SHADOWS.lg,
              backgroundColor: UI_COLORS.background.paper,
              border: `1px solid ${UI_COLORS.border.light}`,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: UI_SHADOWS.xl,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  pb: 1.5,
                  borderBottom: `1px solid ${UI_COLORS.border.light}`,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: UI_COLORS.text.secondary,
                    fontSize: UI_TYPOGRAPHY.fontSize.xs,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('workflowDetail.fieldProject')}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: UI_BORDER_RADIUS.md,
                  backgroundColor: UI_COLORS.background.subtle,
                  border: `1px solid ${UI_COLORS.border.light}`,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: UI_COLORS.text.primary,
                    fontSize: UI_TYPOGRAPHY.fontSize.base,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                  }}
                >
                  {getProjectName(workflow.projectId)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  pb: 1.5,
                  borderBottom: `1px solid ${UI_COLORS.border.light}`,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: UI_COLORS.text.secondary,
                    fontSize: UI_TYPOGRAPHY.fontSize.xs,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Status
                </Typography>
              </Box>
              <Chip
                label={workflow.isActive ? 'Active' : 'Inactive'}
                size="medium"
                color={workflow.isActive ? 'success' : 'default'}
                sx={{
                  mb: 3,
                  fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                  height: 32,
                  boxShadow: UI_SHADOWS.sm,
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  pb: 1.5,
                  borderBottom: `1px solid ${UI_COLORS.border.light}`,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: UI_COLORS.text.secondary,
                    fontSize: UI_TYPOGRAPHY.fontSize.xs,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('workflowDetail.transitionsCount')}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: UI_BORDER_RADIUS.full,
                  bgcolor: UI_COLORS.primary.main,
                  color: UI_COLORS.primary.contrast,
                  boxShadow: UI_SHADOWS.md,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
                    color: UI_COLORS.primary.contrast,
                  }}
                >
                  {workflow.transitions?.length || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

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

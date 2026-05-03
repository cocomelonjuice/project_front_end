import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  LinkOff as LinkOffIcon,
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
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_BUTTON_STYLES } from '../../shared/constants/src/ui';
import { useAuth } from '../../shared/auth/src';

const WorkflowsList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { checkRole } = useAuth();
  const projectsState = useSelectorProjects((state) => state);
  const workflowsState = useSelectorWorkflows((state) => state);
  const canManageWorkflows = checkRole(['admin', 'manager']);
  const workflows = workflowsState.workflows;
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detachDialogOpen, setDetachDialogOpen] = useState(false);

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
  };

  const handleView = (workflow: Workflow) => {
    navigate(`/workflows/${workflow.id}`);
    handleMenuClose();
    setSelectedWorkflow(null);
  };

  const handleEdit = () => {
    if (!canManageWorkflows) return;
    if (selectedWorkflow) {
      setEditModalOpen(true);
      handleMenuClose();
    }
  };

  const handleDelete = () => {
    if (!canManageWorkflows) return;
    if (selectedWorkflow) {
      setDeleteDialogOpen(true);
      handleMenuClose();
    }
  };

  const handleDetach = () => {
    if (!canManageWorkflows || !selectedWorkflow?.projectId) return;
    setDetachDialogOpen(true);
    handleMenuClose();
  };

  const confirmDetach = () => {
    if (!selectedWorkflow) return;
    dispatch(
      workflowsActions.detachWorkflowRequest({
        data: { id: selectedWorkflow.id },
        callback: {
          onSuccess: () => {
            setDetachDialogOpen(false);
            setSelectedWorkflow(null);
          },
        },
      } as any)
    );
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
      return 'Unassigned';
    }
    const project = projectsState.projects.find((p) => p.id === projectId);
    return project ? project.name : 'Unknown';
  };

  const getWorkflowProjectChipStyle = (isGlobal: boolean) => ({
    bgcolor: isGlobal ? 'rgba(148,163,184,0.16)' : 'rgba(59,130,246,0.14)',
    color: isGlobal ? '#334155' : '#1D4ED8',
    border: `1px solid ${isGlobal ? 'rgba(148,163,184,0.32)' : 'rgba(59,130,246,0.3)'}`,
    fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
    fontSize: UI_TYPOGRAPHY.fontSize.xs,
  });

  const getWorkflowStatusChipStyle = (isActive: boolean) => ({
    bgcolor: isActive ? 'rgba(34,197,94,0.14)' : 'rgba(148,163,184,0.16)',
    color: isActive ? '#166534' : '#334155',
    border: `1px solid ${isActive ? 'rgba(34,197,94,0.32)' : 'rgba(148,163,184,0.32)'}`,
    fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
    fontSize: UI_TYPOGRAPHY.fontSize.xs,
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
            color: UI_COLORS.text.primary,
            fontSize: UI_TYPOGRAPHY.fontSize['2xl'],
          }}
        >
          {t('workflowList.title')}
        </Typography>
        {canManageWorkflows && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
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
            {t('workflowList.createWorkflow')}
          </Button>
        )}
      </Box>

      {workflowsState.getWorkflowsLoading ? (
        <Paper
          sx={{
            p: 6,
            borderRadius: UI_BORDER_RADIUS.xl,
            border: `1px solid ${UI_COLORS.border.light}`,
            boxShadow: UI_SHADOWS.md,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CircularProgress sx={{ color: UI_COLORS.primary.main }} />
        </Paper>
      ) : workflows.length === 0 ? (
        <Alert
          severity="info"
          sx={{
            borderRadius: UI_BORDER_RADIUS.md,
            boxShadow: UI_SHADOWS.sm,
            backgroundColor: UI_COLORS.info.bg,
            border: `1px solid ${UI_COLORS.info.light}`,
          }}
        >
          {t('workflowList.empty')}
        </Alert>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: UI_BORDER_RADIUS.xl,
            boxShadow: UI_SHADOWS.lg,
            border: `1px solid ${UI_COLORS.border.light}`,
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: UI_COLORS.background.subtle }}>
                <TableCell
                  sx={{
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    color: UI_COLORS.text.primary,
                    fontSize: UI_TYPOGRAPHY.fontSize.sm,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('workflowList.colName')}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    color: UI_COLORS.text.primary,
                    fontSize: UI_TYPOGRAPHY.fontSize.sm,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('workflowList.colDescription')}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    color: UI_COLORS.text.primary,
                    fontSize: UI_TYPOGRAPHY.fontSize.sm,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('workflowList.colProject')}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    color: UI_COLORS.text.primary,
                    fontSize: UI_TYPOGRAPHY.fontSize.sm,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('workflowList.colStatus')}
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    color: UI_COLORS.text.primary,
                    fontSize: UI_TYPOGRAPHY.fontSize.sm,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('workflowList.colTransitions')}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    color: UI_COLORS.text.primary,
                    fontSize: UI_TYPOGRAPHY.fontSize.sm,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow
                  key={workflow.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: UI_COLORS.background.hover,
                    },
                    transition: 'background-color 0.2s ease-in-out',
                  }}
                >
                  <TableCell>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                        color: UI_COLORS.text.primary,
                        fontSize: UI_TYPOGRAPHY.fontSize.base,
                      }}
                    >
                      {workflow.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: UI_COLORS.text.secondary,
                        fontSize: UI_TYPOGRAPHY.fontSize.sm,
                      }}
                    >
                      {workflow.description || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={getProjectName(workflow.projectId)} size="small" sx={getWorkflowProjectChipStyle(!workflow.projectId)} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={workflow.isActive ? t('workflowDetail.active') : t('workflowDetail.inactive')}
                      size="small"
                      sx={getWorkflowStatusChipStyle(workflow.isActive)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: UI_COLORS.text.primary,
                        fontSize: UI_TYPOGRAPHY.fontSize.sm,
                        fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                      }}
                    >
                      {t('workflowList.transitionCount', {
                        count: workflow.transitions?.length || 0,
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, workflow)}
                      sx={{
                        color: UI_COLORS.text.secondary,
                        '&:hover': {
                          backgroundColor: UI_COLORS.background.hover,
                          color: UI_COLORS.text.primary,
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
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
        PaperProps={{
          sx: {
            borderRadius: UI_BORDER_RADIUS.md,
            boxShadow: UI_SHADOWS.lg,
            border: `1px solid ${UI_COLORS.border.light}`,
            mt: 1,
            minWidth: 150,
          },
        }}
      >
        <MenuItem
          onClick={() => selectedWorkflow && handleView(selectedWorkflow)}
          sx={{
            fontSize: UI_TYPOGRAPHY.fontSize.sm,
            '&:hover': {
              backgroundColor: UI_COLORS.background.hover,
            },
          }}
        >
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          {t('workflowList.viewDetails')}
        </MenuItem>
        {canManageWorkflows && (
          <MenuItem
            onClick={handleEdit}
            sx={{
              fontSize: UI_TYPOGRAPHY.fontSize.sm,
              '&:hover': {
                backgroundColor: UI_COLORS.background.hover,
              },
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            {t('workflowList.menuEdit')}
          </MenuItem>
        )}
        {canManageWorkflows && (
          <MenuItem
            onClick={handleDetach}
            disabled={!selectedWorkflow?.projectId}
            sx={{
              fontSize: UI_TYPOGRAPHY.fontSize.sm,
              '&:hover': {
                backgroundColor: UI_COLORS.background.hover,
              },
            }}
          >
            <LinkOffIcon fontSize="small" sx={{ mr: 1 }} />
            {t('workflowList.menuDetach')}
          </MenuItem>
        )}
        {canManageWorkflows && (
          <MenuItem
            onClick={handleDelete}
            sx={{
              fontSize: UI_TYPOGRAPHY.fontSize.sm,
              color: UI_COLORS.error.main,
              '&:hover': {
                backgroundColor: UI_COLORS.error.bg,
              },
            }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            {t('workflowList.menuDelete')}
          </MenuItem>
        )}
      </Menu>

      {/* Modals */}
      {canManageWorkflows && (
        <CreateWorkflowModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onWorkflowCreated={handleWorkflowCreated}
        />
      )}
      {canManageWorkflows && (
        <EditWorkflowModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedWorkflow(null);
          }}
          workflow={selectedWorkflow}
          onWorkflowUpdated={handleWorkflowUpdated}
        />
      )}
      {canManageWorkflows && (
        <DeleteWorkflowDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedWorkflow(null);
          }}
          workflow={selectedWorkflow}
          onWorkflowDeleted={(workflowId: string) => {
            handleWorkflowDeleted(workflowId);
            setSelectedWorkflow(null);
          }}
        />
      )}
      <Dialog open={detachDialogOpen} onClose={() => setDetachDialogOpen(false)}>
        <DialogTitle>{t('workflowList.detachTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('workflowList.detachConfirm', { name: selectedWorkflow?.name || '' })}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetachDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button color="warning" variant="contained" onClick={confirmDetach}>
            {t('workflowList.detachAction')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorkflowsList;


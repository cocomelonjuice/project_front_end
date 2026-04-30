import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControlLabel,
  Switch,
  Autocomplete,
  CircularProgress,
  Alert,
} from '@mui/material';
import { workflowsActions, useSelectorWorkflows } from '../store';
import { useSelectorProjects } from '../../../projects/src/store';
import type { Workflow } from '../store/states';

interface EditWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  workflow: Workflow | null;
  onWorkflowUpdated?: (workflow: Workflow) => void;
}

const EditWorkflowModal: React.FC<EditWorkflowModalProps> = ({
  open,
  onClose,
  workflow,
  onWorkflowUpdated,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const workflowsState = useSelectorWorkflows((state) => state);
  const projectsState = useSelectorProjects((state) => state);
  const projects = projectsState.projects;

  const assignedProjectIds = useMemo(
    () =>
      new Set(
        workflowsState.workflows
          .filter((item) => item.isActive && item.id !== workflow?.id)
          .map((item) => item.projectId)
          .filter(Boolean)
      ),
    [workflowsState.workflows]
  );
  const projectOptions = useMemo(() => {
    if (!workflow?.projectId) return projects.filter((project) => !assignedProjectIds.has(project.id));
    return projects.filter((project) => project.id === workflow.projectId || !assignedProjectIds.has(project.id));
  }, [projects, assignedProjectIds, workflow?.projectId]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; general?: string }>({});

  useEffect(() => {
    if (open && workflow) {
      setName(workflow.name || '');
      setDescription(workflow.description || '');
      setProjectId(workflow.projectId || null);
      setIsActive(workflow.isActive ?? true);
      setErrors({});
    }
  }, [open, workflow]);

  const validate = (): boolean => {
    const newErrors: { name?: string } = {};
    if (!name.trim()) {
      newErrors.name = t('workflowForm.nameRequired');
    } else if (name.trim().length < 3) {
      newErrors.name = t('workflowForm.nameMin');
    } else if (name.trim().length > 100) {
      newErrors.name = t('workflowForm.nameMax');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!workflow || !validate()) {
      return;
    }

    setErrors({});

    dispatch(
      workflowsActions.updateWorkflowRequest({
        data: {
          id: workflow.id,
          name: name.trim(),
          description: description.trim() || undefined,
          projectId: projectId || undefined,
          isActive,
        },
        callback: {
          onSuccess: (updatedWorkflow: Workflow) => {
            onWorkflowUpdated?.(updatedWorkflow);
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update workflow';
            setErrors({ general: errorMessage });
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!workflowsState.updateWorkflowLoading) {
      setErrors({});
      onClose();
    }
  };

  if (!workflow) {
    return null;
  }

  return (
    <Dialog key={i18n.language} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('workflowForm.editTitle')}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {errors.general && (
            <Alert severity="error">{errors.general}</Alert>
          )}
          <TextField
            label={t('workflowForm.nameLabel')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
            fullWidth
            autoFocus
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label={t('workflowForm.descriptionLabel')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Autocomplete
            options={projectOptions}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={projectId ? projects.find((p) => p.id === projectId) || null : null}
            onChange={(_event, newValue) => {
              if (newValue) {
                setProjectId(newValue.id);
              } else {
                setProjectId(null);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('workflowForm.projectLabel')}
                variant="outlined"
                fullWidth
                helperText={workflow.projectId ? t('workflowForm.detachFirstToReassign') : undefined}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
            disabled={workflowsState.updateWorkflowLoading || !!workflow.projectId}
          />
          {!projectOptions.length && (
            <Alert severity="info">{t('workflowForm.noAvailableProjects')}</Alert>
          )}

          <FormControlLabel
            control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
            label={t('workflowForm.activeLabel')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={workflowsState.updateWorkflowLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={workflowsState.updateWorkflowLoading || !name.trim() || !projectId}
          startIcon={workflowsState.updateWorkflowLoading ? <CircularProgress size={16} /> : null}
        >
          {workflowsState.updateWorkflowLoading ? t('workflowForm.updating') : t('workflowForm.update')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditWorkflowModal;

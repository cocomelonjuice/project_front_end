import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
  const dispatch = useDispatch();
  const workflowsState = useSelectorWorkflows((state) => state);
  const projectsState = useSelectorProjects((state) => state);
  const projects = projectsState.projects;
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
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Name must be at most 100 characters';
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
          projectId: projectId || null,
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Workflow</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {errors.general && (
            <Alert severity="error">{errors.general}</Alert>
          )}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
            fullWidth
            autoFocus
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />

          <Autocomplete
            options={[{ id: 'global', name: 'Global (All Projects)' }, ...projects]}
            getOptionLabel={(option) => (option.id === 'global' ? 'Global (All Projects)' : option.name)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={projectId ? projects.find((p) => p.id === projectId) || null : { id: 'global', name: 'Global (All Projects)' }}
            onChange={(_event, newValue) => {
              if (newValue && newValue.id === 'global') {
                setProjectId(null);
              } else if (newValue) {
                setProjectId(newValue.id);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Project"
                placeholder="Select project (or Global)"
                variant="outlined"
                fullWidth
              />
            )}
            disabled={workflowsState.updateWorkflowLoading}
          />

          <FormControlLabel
            control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
            label="Active"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={workflowsState.updateWorkflowLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={workflowsState.updateWorkflowLoading || !name.trim()}
          startIcon={workflowsState.updateWorkflowLoading ? <CircularProgress size={16} /> : null}
        >
          {workflowsState.updateWorkflowLoading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditWorkflowModal;

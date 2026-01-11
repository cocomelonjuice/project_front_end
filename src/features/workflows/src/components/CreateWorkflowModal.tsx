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
  Typography,
  Alert,
} from '@mui/material';
import { workflowsActions, useSelectorWorkflows } from '../store';
import { useSelectorProjects } from '../../../projects/src/store';
import type { Workflow } from '../store/states';

interface CreateWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  onWorkflowCreated?: (workflow: Workflow) => void;
}

const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({
  open,
  onClose,
  onWorkflowCreated,
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
    if (open) {
      // Reset form when modal opens
      setName('');
      setDescription('');
      setProjectId(null);
      setIsActive(true);
      setErrors({});
    }
  }, [open]);

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
    if (!validate()) {
      return;
    }

    setErrors({});

    dispatch(
      workflowsActions.createWorkflowRequest({
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          projectId: projectId || undefined,
          isActive,
        },
        callback: {
          onSuccess: (newWorkflow: Workflow) => {
            onWorkflowCreated?.(newWorkflow);
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create workflow';
            setErrors({ general: errorMessage });
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!workflowsState.createWorkflowLoading) {
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Workflow</DialogTitle>
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
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Description"
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
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
            disabled={workflowsState.createWorkflowLoading}
          />

          <FormControlLabel
            control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
            label="Active"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={workflowsState.createWorkflowLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={workflowsState.createWorkflowLoading || !name.trim()}
          startIcon={workflowsState.createWorkflowLoading ? <CircularProgress size={16} /> : null}
        >
          {workflowsState.createWorkflowLoading ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateWorkflowModal;

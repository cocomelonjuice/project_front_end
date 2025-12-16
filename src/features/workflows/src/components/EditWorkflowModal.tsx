import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import type { Workflow } from '../store/states';
import { mockProjects } from '../../../projects/src';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (open && workflow) {
      setName(workflow.name || '');
      setDescription(workflow.description || '');
      setProjectId(workflow.projectId || null);
      setIsActive(workflow.isActive ?? true);
      setErrors({});
      setIsSubmitting(false);
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

    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      const updatedWorkflow: Workflow = {
        ...workflow,
        projectId: projectId || null,
        name: name.trim(),
        description: description.trim() || undefined,
        isActive,
      };

      onWorkflowUpdated?.(updatedWorkflow);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const handleClose = () => {
    if (!isSubmitting) {
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
            options={[{ id: 'global', name: 'Global (All Projects)' }, ...mockProjects]}
            getOptionLabel={(option) => (option.id === 'global' ? 'Global (All Projects)' : option.name)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={projectId ? mockProjects.find((p) => p.id === projectId) || null : { id: 'global', name: 'Global (All Projects)' }}
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
            disabled={isSubmitting}
          />

          <FormControlLabel
            control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
            label="Active"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !name.trim()}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
        >
          {isSubmitting ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditWorkflowModal;

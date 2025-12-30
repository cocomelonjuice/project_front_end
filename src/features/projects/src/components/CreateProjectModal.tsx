import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { projectsActions, useSelectorProjects } from '../store';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onProjectCreated?: () => void;
  existingKeys?: string[]; // For validation - check if key already exists
}

const projectTypes = [
  { value: 'software', label: 'Software' },
  { value: 'business', label: 'Business' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operations' },
];

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  onClose,
  onProjectCreated,
  existingKeys = [],
}) => {
  const dispatch = useDispatch();
  const projectsState = useSelectorProjects((state) => state);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    key: '',
    type: 'software',
    description: '',
  });

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setError(null);
      setFormData({
        name: '',
        key: '',
        type: 'software',
        description: '',
      });
    }
  }, [open]);

  const handleChange = (field: string) => (event: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-uppercase and limit to 20 characters
    const value = event.target.value.toUpperCase().slice(0, 20);
    setFormData((prev) => ({
      ...prev,
      key: value,
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    if (!formData.key.trim()) {
      setError('Project key is required');
      return;
    }

    // Check if key already exists
    if (existingKeys.includes(formData.key.toUpperCase())) {
      setError('Project key already exists. Please choose a different key.');
      return;
    }

    // Validate key format (alphanumeric, max 20 chars)
    if (!/^[A-Z0-9]+$/.test(formData.key)) {
      setError('Project key must contain only uppercase letters and numbers');
      return;
    }

    setError(null);

    // Dispatch Redux action to create project
    dispatch(
      projectsActions.createProjectRequest({
        data: {
          key: formData.key.toUpperCase(),
          name: formData.name.trim(),
          type: formData.type,
          description: formData.description.trim() || undefined,
        },
        callback: {
          onSuccess: () => {
            if (onProjectCreated) {
              onProjectCreated();
            }
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create project';
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!projectsState.createProjectLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Project</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <TextField
            label="Project Name"
            required
            fullWidth
            value={formData.name}
            onChange={handleChange('name')}
            disabled={projectsState.createProjectLoading}
            placeholder="Enter project name"
            helperText="A descriptive name for your project"
          />

          <TextField
            label="Project Key"
            required
            fullWidth
            value={formData.key}
            onChange={handleKeyChange}
            disabled={projectsState.createProjectLoading}
            placeholder="PROJ"
            helperText="Unique key (uppercase letters and numbers, max 20 characters)"
            inputProps={{ maxLength: 20 }}
          />

          <FormControl fullWidth required>
            <InputLabel>Project Type</InputLabel>
            <Select
              value={formData.type}
              onChange={handleChange('type')}
              label="Project Type"
              disabled={projectsState.createProjectLoading}
            >
              {projectTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange('description')}
            disabled={projectsState.createProjectLoading}
            placeholder="Enter project description (optional)"
            helperText="Describe the purpose and goals of this project"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={projectsState.createProjectLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={projectsState.createProjectLoading || !formData.name.trim() || !formData.key.trim()}
          startIcon={projectsState.createProjectLoading ? <CircularProgress size={16} /> : null}
        >
          {projectsState.createProjectLoading ? 'Creating...' : 'Create Project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectModal;





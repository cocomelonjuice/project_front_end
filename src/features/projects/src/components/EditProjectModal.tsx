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
import type { Project } from '../store/states';

interface EditProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null; // Project to edit
  onProjectUpdated?: () => void;
  existingKeys?: string[]; // For validation - check if key already exists
}

const projectTypes = [
  { value: 'software', label: 'Software' },
  { value: 'business', label: 'Business' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operations' },
];

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  open,
  onClose,
  project,
  onProjectUpdated,
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
    if (open && project) {
      // Pre-fill form with existing project data
      setError(null);
      setFormData({
        name: project.name || '',
        key: project.key || '',
        type: project.type || 'software',
        description: project.description || '',
      });
    }
  }, [open, project]);

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
    if (!project) return;

    // Validation
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    if (!formData.key.trim()) {
      setError('Project key is required');
      return;
    }

    // Check if key already exists (excluding current project's key)
    const otherKeys = existingKeys.filter((key) => key !== project.key.toUpperCase());
    if (otherKeys.includes(formData.key.toUpperCase())) {
      setError('Project key already exists. Please choose a different key.');
      return;
    }

    // Validate key format (alphanumeric, max 20 chars)
    if (!/^[A-Z0-9]+$/.test(formData.key)) {
      setError('Project key must contain only uppercase letters and numbers');
      return;
    }

    setError(null);

    // Dispatch Redux action to update project
    // Note: Don't include 'id' in the data - it's passed separately as the first parameter
    dispatch(
      projectsActions.updateProjectRequest({
        data: {
          id: project.id, // This is used to identify which project to update
          key: formData.key.toUpperCase(),
          name: formData.name.trim(),
          type: formData.type,
          description: formData.description.trim() || undefined,
        },
        callback: {
          onSuccess: () => {
            if (onProjectUpdated) {
              onProjectUpdated();
            }
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update project';
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!projectsState.updateProjectLoading) {
      onClose();
    }
  };

  if (!project) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Project</DialogTitle>
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
            disabled={projectsState.updateProjectLoading}
            placeholder="Enter project name"
            helperText="A descriptive name for your project"
          />

          <TextField
            label="Project Key"
            required
            fullWidth
            value={formData.key}
            onChange={handleKeyChange}
            disabled={projectsState.updateProjectLoading}
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
              disabled={projectsState.updateProjectLoading}
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
            disabled={projectsState.updateProjectLoading}
            placeholder="Enter project description (optional)"
            helperText="Describe the purpose and goals of this project"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={projectsState.updateProjectLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={projectsState.updateProjectLoading || !formData.name.trim() || !formData.key.trim()}
          startIcon={projectsState.updateProjectLoading ? <CircularProgress size={16} /> : null}
        >
          {projectsState.updateProjectLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectModal;





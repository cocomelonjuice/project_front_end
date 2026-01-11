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
  Typography,
} from '@mui/material';
import { projectsActions, useSelectorProjects } from '../store';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_TRANSITIONS, UI_INPUT_STYLES, UI_BUTTON_STYLES } from '../../../../shared/constants/src/ui';

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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: UI_BORDER_RADIUS.xl,
          boxShadow: UI_SHADOWS['2xl'],
        },
      }}
     
    >
      <DialogTitle
        sx={{
          pb: 1,
          // borderBottom: `1px solid ${UI_COLORS.border.light}`,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
            color: UI_COLORS.text.primary,
            fontSize: UI_TYPOGRAPHY.fontSize.xl,
          }}
        >
          Create New Project
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 4 }}>
        <Box sx={{mt:3,  display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{
                borderRadius: UI_BORDER_RADIUS.md,
                backgroundColor: UI_COLORS.error.bg,
                color: UI_COLORS.error.dark,
                '& .MuiAlert-icon': {
                  color: UI_COLORS.error.main,
                },
              }}
            >
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
            helperText="A descriptive name for your project"
            sx={UI_INPUT_STYLES.default}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
              },
            }}
            FormHelperTextProps={{
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.xs,
                color: UI_COLORS.text.secondary,
              },
            }}
          />

          <TextField
            label="Project Key"
            required
            fullWidth
            value={formData.key}
            onChange={handleKeyChange}
            disabled={projectsState.createProjectLoading}
            helperText="Unique key (uppercase letters and numbers, max 20 characters)"
            inputProps={{ maxLength: 20 }}
            sx={UI_INPUT_STYLES.default}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
              },
            }}
            FormHelperTextProps={{
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.xs,
                color: UI_COLORS.text.secondary,
              },
            }}
          />

          <FormControl
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: UI_BORDER_RADIUS.md,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: UI_COLORS.primary.light,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: UI_COLORS.primary.main,
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root': {
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
                color: UI_COLORS.text.secondary,
                '&.Mui-focused': {
                  color: UI_COLORS.primary.main,
                },
              },
            }}
          >
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
            rows={3}
            value={formData.description}
            onChange={handleChange('description')}
            disabled={projectsState.createProjectLoading}
            helperText="Describe the purpose and goals of this project (optional)"
            sx={UI_INPUT_STYLES.default}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
              },
            }}
            FormHelperTextProps={{
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.xs,
                color: UI_COLORS.text.secondary,
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          borderTop: `1px solid ${UI_COLORS.border.light}`,
          gap: 1.5,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={projectsState.createProjectLoading}
          sx={{
            textTransform: 'none',
            fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
            color: UI_COLORS.text.secondary,
            '&:hover': {
              backgroundColor: UI_COLORS.background.hover,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={projectsState.createProjectLoading || !formData.name.trim() || !formData.key.trim()}
          startIcon={projectsState.createProjectLoading ? <CircularProgress size={16} sx={{ color: UI_COLORS.primary.contrast }} /> : null}
          sx={{
            textTransform: 'none',
            fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
            borderRadius: UI_BORDER_RADIUS.md,
            px: 3,
            transition: UI_TRANSITIONS.normal,
            ...UI_BUTTON_STYLES.primary,
          }}
        >
          {projectsState.createProjectLoading ? 'Creating...' : 'Create Project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProjectModal;





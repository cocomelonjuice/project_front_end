import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
import type { Project } from '../store/states';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_TRANSITIONS, UI_INPUT_STYLES, UI_BUTTON_STYLES } from '../../../../shared/constants/src/ui';

interface EditProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null; // Project to edit
  onProjectUpdated?: () => void;
  existingKeys?: string[]; // For validation - check if key already exists
}

const PROJECT_TYPE_VALUES = ['software', 'business', 'marketing', 'operations'] as const;

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  open,
  onClose,
  project,
  onProjectUpdated,
  existingKeys = [],
}) => {
  const { t, i18n } = useTranslation();
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
    const value = event.target.value.toUpperCase().slice(0, 20);
    setFormData((prev) => ({
      ...prev,
      key: value,
    }));
  };

  const handleSubmit = () => {
    if (!project) return;

    if (!formData.name.trim()) {
      setError(t('projects.nameRequired'));
      return;
    }

    if (!formData.key.trim()) {
      setError(t('projects.keyRequired'));
      return;
    }

    const otherKeys = existingKeys.filter((key) => key !== project.key.toUpperCase());
    if (otherKeys.includes(formData.key.toUpperCase())) {
      setError(t('projects.keyExists'));
      return;
    }

    if (!/^[A-Z0-9]+$/.test(formData.key)) {
      setError(t('projects.keyInvalid'));
      return;
    }

    setError(null);

    dispatch(
      projectsActions.updateProjectRequest({
        data: {
          id: project.id,
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
            const errorMessage =
              error?.response?.data?.message || error?.message || t('projects.updateFailed');
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
    <Dialog
      key={i18n.language}
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
          {t('projects.editTitle')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
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
            label={t('projects.nameLabel')}
            required
            fullWidth
            value={formData.name}
            onChange={handleChange('name')}
            disabled={projectsState.updateProjectLoading}
            helperText={t('projects.helperName')}
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
            label={t('projects.keyLabel')}
            required
            fullWidth
            value={formData.key}
            onChange={handleKeyChange}
            disabled={projectsState.updateProjectLoading}
            helperText={t('projects.helperKey')}
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
            <InputLabel>{t('projects.typeLabel')}</InputLabel>
            <Select
              value={formData.type}
              onChange={handleChange('type')}
              label={t('projects.typeLabel')}
              disabled={projectsState.updateProjectLoading}
            >
              {PROJECT_TYPE_VALUES.map((typeValue) => (
                <MenuItem key={typeValue} value={typeValue}>
                  {t(`projects.types.${typeValue}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label={t('projects.descriptionLabel')}
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange('description')}
            disabled={projectsState.updateProjectLoading}
            helperText={t('projects.helperDescription')}
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
          disabled={projectsState.updateProjectLoading}
          sx={{
            textTransform: 'none',
            fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
            color: UI_COLORS.text.secondary,
            '&:hover': {
              backgroundColor: UI_COLORS.background.hover,
            },
          }}
        >
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={projectsState.updateProjectLoading || !formData.name.trim() || !formData.key.trim()}
          startIcon={projectsState.updateProjectLoading ? <CircularProgress size={16} sx={{ color: UI_COLORS.primary.contrast }} /> : null}
          sx={{
            textTransform: 'none',
            fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
            borderRadius: UI_BORDER_RADIUS.md,
            px: 3,
            transition: UI_TRANSITIONS.normal,
            ...UI_BUTTON_STYLES.primary,
          }}
        >
          {projectsState.updateProjectLoading ? t('projects.saving') : t('projects.saveChanges')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectModal;

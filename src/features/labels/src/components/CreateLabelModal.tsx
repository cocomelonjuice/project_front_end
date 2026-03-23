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
  Box,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import { labelsActions, useSelectorLabels } from '../store';
import type { Label } from '../store/states';
import { getRandomColor, isValidHexColor } from '../store/mockData';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS } from '../../../../shared/constants/src/ui';

interface CreateLabelModalProps {
  open: boolean;
  onClose: () => void;
  onLabelCreated?: (label: Label) => void;
  existingLabels?: Label[]; // For name uniqueness check
}

const CreateLabelModal: React.FC<CreateLabelModalProps> = ({
  open,
  onClose,
  onLabelCreated,
  existingLabels = [],
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const labelsState = useSelectorLabels((state) => state);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#FF5733');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setError(null);
      setName('');
      setColor(getRandomColor());
      setDescription('');
    }
  }, [open]);

  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      setError(t('labelModal.nameRequired'));
      return;
    }

    if (name.length > 50) {
      setError(t('labelModal.nameMax'));
      return;
    }

    // Check for duplicate name
    const nameExists = existingLabels.some(
      (l) => l.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (nameExists) {
      setError(t('labelModal.duplicateName'));
      return;
    }

    // Validate color if provided
    if (color && !isValidHexColor(color)) {
      setError(t('labelModal.colorInvalid'));
      return;
    }

    setError(null);

    dispatch(
      labelsActions.createLabelRequest({
        data: {
          name: name.trim(),
          color: color || undefined,
          description: description.trim() || undefined,
        },
        callback: {
          onSuccess: (newLabel: Label) => {
            onLabelCreated?.(newLabel);
            setName('');
            setColor(getRandomColor());
            setDescription('');
            onClose();
          },
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.message || error?.message || t('labelModal.createFailed');
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!labelsState.createLabelLoading) {
      setError(null);
      onClose();
    }
  };

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
          {t('labelModal.createTitle')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ pt: 1 }}>
          <TextField
            label={t('labelModal.nameLabel')}
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={labelsState.createLabelLoading}
            autoFocus
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 50 }}
            helperText={t('labelModal.charCount50', { current: name.length })}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('labelModal.colorSection')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: color,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              />
              <TextField
                label="Hex Color"
                value={color}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.startsWith('#') && value.length <= 7) {
                    setColor(value);
                  } else if (!value.startsWith('#') && value.length <= 6) {
                    setColor('#' + value);
                  }
                }}
                disabled={labelsState.createLabelLoading}
                size="small"
                sx={{ flex: 1 }}
                error={color ? !isValidHexColor(color) : false}
                helperText={color && !isValidHexColor(color) ? t('labelModal.invalidHex') : ''}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Box>

          <TextField
            label={t('labelModal.descriptionOptional')}
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={labelsState.createLabelLoading}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={labelsState.createLabelLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={labelsState.createLabelLoading || !name.trim()}
          startIcon={labelsState.createLabelLoading ? <CircularProgress size={16} /> : null}
        >
          {labelsState.createLabelLoading ? t('labelModal.creating') : t('labelModal.createLabel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLabelModal;

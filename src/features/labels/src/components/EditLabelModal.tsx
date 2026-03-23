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
import { isValidHexColor } from '../store/mockData';

interface EditLabelModalProps {
  open: boolean;
  onClose: () => void;
  label: Label | null;
  onLabelUpdated?: (label: Label) => void;
  existingLabels?: Label[]; // For name uniqueness check (excluding current label)
}

const EditLabelModal: React.FC<EditLabelModalProps> = ({
  open,
  onClose,
  label,
  onLabelUpdated,
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
    if (open && label) {
      // Populate form with label data
      setError(null);
      setName(label.name);
      setColor(label.color || '#FF5733');
      setDescription(label.description || '');
    }
  }, [open, label]);

  const handleSubmit = () => {
    if (!label) return;

    // Validation
    if (!name.trim()) {
      setError(t('labelModal.nameRequired'));
      return;
    }

    if (name.length > 50) {
      setError(t('labelModal.nameMax'));
      return;
    }

    // Check for duplicate name (excluding current label)
    const nameExists = existingLabels
      .filter((l) => l.id !== label.id)
      .some((l) => l.name.toLowerCase() === name.trim().toLowerCase());
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
      labelsActions.updateLabelRequest({
        data: {
          id: label.id,
          name: name.trim(),
          color: color || undefined,
          description: description.trim() || undefined,
        },
        callback: {
          onSuccess: (updatedLabel: Label) => {
            onLabelUpdated?.(updatedLabel);
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || t('labelModal.updateFailed');
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!labelsState.updateLabelLoading) {
      setError(null);
      onClose();
    }
  };

  if (!label) return null;

  return (
    <Dialog key={i18n.language} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('labelModal.editTitle')}</DialogTitle>
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
            disabled={labelsState.updateLabelLoading}
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
                disabled={labelsState.updateLabelLoading}
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
            disabled={labelsState.updateLabelLoading}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={labelsState.updateLabelLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={labelsState.updateLabelLoading || !name.trim()}
          startIcon={labelsState.updateLabelLoading ? <CircularProgress size={16} /> : null}
        >
          {labelsState.updateLabelLoading ? t('labelModal.updating') : t('labelModal.updateLabel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLabelModal;

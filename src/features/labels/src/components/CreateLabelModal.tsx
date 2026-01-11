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
      setError('Label name is required');
      return;
    }

    if (name.length > 50) {
      setError('Label name must be 50 characters or less');
      return;
    }

    // Check for duplicate name
    const nameExists = existingLabels.some(
      (l) => l.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (nameExists) {
      setError('A label with this name already exists');
      return;
    }

    // Validate color if provided
    if (color && !isValidHexColor(color)) {
      setError('Color must be a valid hex color code (e.g., #FF5733)');
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
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create label';
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
          Create Label
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
            label="Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={labelsState.createLabelLoading}
            autoFocus
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 50 }}
            helperText={`${name.length}/50 characters`}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Color
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
                helperText={color && !isValidHexColor(color) ? 'Invalid hex color' : ''}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Box>

          <TextField
            label="Description (Optional)"
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
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={labelsState.createLabelLoading || !name.trim()}
          startIcon={labelsState.createLabelLoading ? <CircularProgress size={16} /> : null}
        >
          {labelsState.createLabelLoading ? 'Creating...' : 'Create Label'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLabelModal;

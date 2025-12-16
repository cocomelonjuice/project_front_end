import React, { useState, useEffect } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#FF5733');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open && label) {
      // Populate form with label data
      setError(null);
      setIsSubmitting(false);
      setName(label.name);
      setColor(label.color || '#FF5733');
      setDescription(label.description || '');
    }
  }, [open, label]);

  const handleSubmit = () => {
    if (!label) return;

    // Validation
    if (!name.trim()) {
      setError('Label name is required');
      return;
    }

    if (name.length > 50) {
      setError('Label name must be 50 characters or less');
      return;
    }

    // Check for duplicate name (excluding current label)
    const nameExists = existingLabels
      .filter((l) => l.id !== label.id)
      .some((l) => l.name.toLowerCase() === name.trim().toLowerCase());
    if (nameExists) {
      setError('A label with this name already exists');
      return;
    }

    // Validate color if provided
    if (color && !isValidHexColor(color)) {
      setError('Color must be a valid hex color code (e.g., #FF5733)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate API call delay
    setTimeout(() => {
      const updatedLabel: Label = {
        ...label,
        name: name.trim(),
        color: color || undefined,
        description: description.trim() || undefined,
      };

      onLabelUpdated?.(updatedLabel);

      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!label) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Label</DialogTitle>
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
            disabled={isSubmitting}
            placeholder="e.g., bug, feature, urgent"
            autoFocus
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 50 }}
            helperText={`${name.length}/50 characters`}
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
                disabled={isSubmitting}
                placeholder="#FF5733"
                size="small"
                sx={{ flex: 1 }}
                error={color ? !isValidHexColor(color) : false}
                helperText={color && !isValidHexColor(color) ? 'Invalid hex color' : ''}
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
            disabled={isSubmitting}
            placeholder="Describe what this label is used for..."
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
          {isSubmitting ? 'Updating...' : 'Update Label'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLabelModal;

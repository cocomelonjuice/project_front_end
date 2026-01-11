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
import adminApi from '../store/api';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS } from '../../../../shared/constants/src/ui';

interface AddPriorityModalProps {
  open: boolean;
  onClose: () => void;
  onPriorityAdded?: () => void;
  existingNames?: string[];
}

const AddPriorityModal: React.FC<AddPriorityModalProps> = ({
  open,
  onClose,
  onPriorityAdded,
  existingNames = [],
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [orderNum, setOrderNum] = useState<number>(1);

  useEffect(() => {
    if (open) {
      setError(null);
      setName('');
      setOrderNum(1);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (name.length > 50) {
      setError('Name must be 50 characters or less');
      return;
    }

    if (existingNames.includes(name.trim().toLowerCase())) {
      setError('A priority with this name already exists');
      return;
    }

    if (orderNum < 1) {
      setError('Order number must be at least 1');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await adminApi.createPriority({
        name: name.trim(),
        orderNum,
      });

      if (onPriorityAdded) {
        onPriorityAdded();
      }
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create priority';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
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
          Add Priority
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <TextField
            label="Name"
            required
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            autoFocus
            inputProps={{ maxLength: 50 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Order Number"
            required
            fullWidth
            type="number"
            value={orderNum}
            onChange={(e) => setOrderNum(parseInt(e.target.value) || 1)}
            disabled={loading}
            inputProps={{ min: 1 }}
            helperText="Lower numbers appear first"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !name.trim()}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Creating...' : 'Create Priority'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPriorityModal;





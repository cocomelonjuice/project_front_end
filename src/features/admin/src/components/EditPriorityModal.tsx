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
} from '@mui/material';
import adminApi from '../store/api';
import type { SystemSetting } from '../store/states';

interface EditPriorityModalProps {
  open: boolean;
  onClose: () => void;
  priority: SystemSetting | null;
  onPriorityUpdated?: () => void;
}

const EditPriorityModal: React.FC<EditPriorityModalProps> = ({
  open,
  onClose,
  priority,
  onPriorityUpdated,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [orderNum, setOrderNum] = useState<number>(1);

  useEffect(() => {
    if (open && priority) {
      setError(null);
      setName(priority.name || '');
      setOrderNum(priority.orderNum || 1);
    }
  }, [open, priority]);

  const handleSubmit = async () => {
    if (!priority) return;

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (name.length > 50) {
      setError('Name must be 50 characters or less');
      return;
    }

    if (orderNum < 1) {
      setError('Order number must be at least 1');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await adminApi.updatePriority(priority.id, {
        name: name.trim(),
        orderNum,
      });

      if (onPriorityUpdated) {
        onPriorityUpdated();
      }
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update priority';
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

  if (!priority) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Priority</DialogTitle>
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
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPriorityModal;





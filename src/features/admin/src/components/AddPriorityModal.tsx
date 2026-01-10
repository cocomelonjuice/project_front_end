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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Priority</DialogTitle>
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
            placeholder="e.g., Lowest, Low, Medium, High, Highest"
            autoFocus
            inputProps={{ maxLength: 50 }}
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





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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import adminApi from '../store/api';

interface AddStatusModalProps {
  open: boolean;
  onClose: () => void;
  onStatusAdded?: () => void;
  existingNames?: string[];
}

const statusCategories = [
  { value: 'todo', label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const AddStatusModal: React.FC<AddStatusModalProps> = ({
  open,
  onClose,
  onStatusAdded,
  existingNames = [],
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('todo');
  const [color, setColor] = useState('#808080');

  useEffect(() => {
    if (open) {
      setError(null);
      setName('');
      setCategory('todo');
      setColor('#808080');
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
      setError('A status with this name already exists');
      return;
    }

    if (!category) {
      setError('Category is required');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await adminApi.createStatus({
        name: name.trim(),
        category,
        color: color || undefined,
      });

      if (onStatusAdded) {
        onStatusAdded();
      }
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create status';
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
      <DialogTitle>Add Status</DialogTitle>
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
            placeholder="e.g., To Do, In Progress, Done"
            autoFocus
            inputProps={{ maxLength: 50 }}
          />

          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
              disabled={loading}
            >
              {statusCategories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
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
                disabled={loading}
                placeholder="#808080"
                size="small"
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
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
          {loading ? 'Creating...' : 'Create Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStatusModal;





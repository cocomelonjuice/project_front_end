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
import type { SystemSetting } from '../store/states';

interface EditStatusModalProps {
  open: boolean;
  onClose: () => void;
  status: SystemSetting | null;
  onStatusUpdated?: () => void;
}

const statusCategories = [
  { value: 'todo', label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const EditStatusModal: React.FC<EditStatusModalProps> = ({
  open,
  onClose,
  status,
  onStatusUpdated,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('todo');
  const [color, setColor] = useState('#808080');

  useEffect(() => {
    if (open && status) {
      setError(null);
      setName(status.name || '');
      setCategory(status.category || 'todo');
      setColor(status.color || '#808080');
    }
  }, [open, status]);

  const handleSubmit = async () => {
    if (!status) return;

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (name.length > 50) {
      setError('Name must be 50 characters or less');
      return;
    }

    if (!category) {
      setError('Category is required');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await adminApi.updateStatus(status.id, {
        name: name.trim(),
        category,
        color: color || undefined,
      });

      if (onStatusUpdated) {
        onStatusUpdated();
      }
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update status';
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

  if (!status) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Status</DialogTitle>
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
                size="small"
                sx={{ flex: 1 }}
                InputLabelProps={{
                  shrink: true,
                }}
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
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStatusModal;





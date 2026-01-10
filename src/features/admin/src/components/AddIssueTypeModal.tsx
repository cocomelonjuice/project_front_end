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

interface AddIssueTypeModalProps {
  open: boolean;
  onClose: () => void;
  onIssueTypeAdded?: () => void;
  existingNames?: string[];
}

const AddIssueTypeModal: React.FC<AddIssueTypeModalProps> = ({
  open,
  onClose,
  onIssueTypeAdded,
  existingNames = [],
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open) {
      setError(null);
      setName('');
      setDescription('');
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
      setError('An issue type with this name already exists');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await adminApi.createIssueType({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      if (onIssueTypeAdded) {
        onIssueTypeAdded();
      }
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create issue type';
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
      <DialogTitle>Add Issue Type</DialogTitle>
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
            placeholder="e.g., Bug, Task, Story"
            autoFocus
            inputProps={{ maxLength: 50 }}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            placeholder="Describe this issue type..."
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
          {loading ? 'Creating...' : 'Create Issue Type'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddIssueTypeModal;





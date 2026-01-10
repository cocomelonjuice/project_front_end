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

interface EditIssueTypeModalProps {
  open: boolean;
  onClose: () => void;
  issueType: SystemSetting | null;
  onIssueTypeUpdated?: () => void;
}

const EditIssueTypeModal: React.FC<EditIssueTypeModalProps> = ({
  open,
  onClose,
  issueType,
  onIssueTypeUpdated,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open && issueType) {
      setError(null);
      setName(issueType.name || '');
      setDescription(issueType.description || '');
    }
  }, [open, issueType]);

  const handleSubmit = async () => {
    if (!issueType) return;

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (name.length > 50) {
      setError('Name must be 50 characters or less');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await adminApi.updateIssueType(issueType.id, {
        name: name.trim(),
        description: description.trim() || undefined,
      });

      if (onIssueTypeUpdated) {
        onIssueTypeUpdated();
      }
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update issue type';
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

  if (!issueType) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Issue Type</DialogTitle>
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
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditIssueTypeModal;





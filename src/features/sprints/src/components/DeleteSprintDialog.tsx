import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import type { Sprint } from '../store/states';

interface DeleteSprintDialogProps {
  open: boolean;
  onClose: () => void;
  sprint: Sprint | null;
  onSprintDeleted?: (sprintId: string) => void;
}

const DeleteSprintDialog: React.FC<DeleteSprintDialogProps> = ({
  open,
  onClose,
  sprint,
  onSprintDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!sprint) return;

    setIsDeleting(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Call callback to remove from list
      if (onSprintDeleted) {
        onSprintDeleted(sprint.id);
      }

      // Close dialog
      onClose();
    } catch (err) {
      setError('Failed to delete sprint. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError(null);
      onClose();
    }
  };

  if (!sprint) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Sprint</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
            {sprint.name}
          </Typography>
          {sprint.goal && (
            <Typography variant="body2" color="text.secondary">
              {sprint.goal}
            </Typography>
          )}
        </Box>

        <DialogContentText>
          Are you sure you want to delete this sprint?
          <br />
          <br />
          This action cannot be undone. All issues in this sprint will remain but will no longer be associated with a sprint.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={16} /> : null}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteSprintDialog;

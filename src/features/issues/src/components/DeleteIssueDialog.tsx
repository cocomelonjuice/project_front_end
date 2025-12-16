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
} from '@mui/material';
import type { Issue } from '../store/states';

interface DeleteIssueDialogProps {
  open: boolean;
  onClose: () => void;
  issue: Issue | null;
  onIssueDeleted?: (issueId: string) => void;
}

const DeleteIssueDialog: React.FC<DeleteIssueDialogProps> = ({
  open,
  onClose,
  issue,
  onIssueDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!issue) return;

    setIsDeleting(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Call callback to remove from list
      if (onIssueDeleted) {
        onIssueDeleted(issue.id);
      }

      // Close dialog
      onClose();
    } catch (err) {
      setError('Failed to delete issue. Please try again.');
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

  if (!issue) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Issue</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DialogContentText>
          Are you sure you want to delete issue <strong>{issue.key}</strong>?
          <br />
          <br />
          This action cannot be undone. All comments, attachments, and history associated with this
          issue will be permanently deleted.
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

export default DeleteIssueDialog;

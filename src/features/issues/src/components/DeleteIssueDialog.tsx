import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { issuesActions } from '../store';
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
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!issue) return;

    setIsDeleting(true);
    setError(null);

    // Dispatch Redux action to delete issue via API
    dispatch(
      issuesActions.deleteIssueRequest({
        data: { id: issue.id },
        callback: {
          onSuccess: () => {
            // Issue deleted successfully
            onIssueDeleted?.(issue.id);
            setIsDeleting(false);
            onClose();
          },
          onError: (error: any) => {
            console.error('Failed to delete issue:', error);
            setError(error?.response?.data?.message || 'Failed to delete issue. Please try again.');
            setIsDeleting(false);
          },
        },
      } as any)
    );
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

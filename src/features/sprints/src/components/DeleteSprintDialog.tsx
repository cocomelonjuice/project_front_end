import React, { useState, useEffect } from 'react';
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
  Box,
  Typography,
} from '@mui/material';
import { sprintsActions, useSelectorSprints } from '../store';
import type { Sprint } from '../store/states';

interface DeleteSprintDialogProps {
  open: boolean;
  onClose: () => void;
  sprint: Sprint | null;
  onSprintDeleted?: () => void;
}

const DeleteSprintDialog: React.FC<DeleteSprintDialogProps> = ({
  open,
  onClose,
  sprint,
  onSprintDeleted,
}) => {
  const dispatch = useDispatch();
  const sprintsState = useSelectorSprints((state) => state);
  const [error, setError] = useState<string | null>(null);

  const isDeleting = sprintsState.deleteSprintLoading;

  useEffect(() => {
    if (open) {
      setError(null);
      dispatch(sprintsActions.clearErrors());
    }
  }, [open, dispatch]);

  // Handle errors from Redux
  useEffect(() => {
    if (sprintsState.errors && sprintsState.errors.length > 0) {
      setError(sprintsState.errors[0].msg);
    }
  }, [sprintsState.errors]);

  const handleDelete = () => {
    if (!sprint) return;

    setError(null);

    dispatch(
      sprintsActions.deleteSprintRequest({
        data: { id: sprint.id },
        callback: {
          onSuccess: () => {
            onSprintDeleted?.();
            onClose();
          },
          onError: () => {
            // Error is handled by Redux state
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError(null);
      dispatch(sprintsActions.clearErrors());
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

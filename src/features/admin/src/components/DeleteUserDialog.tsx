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
import { adminActions, useSelectorAdmin } from '../store';
import type { AdminUser } from '../store/states';

interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onUserDeleted?: () => void;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  onClose,
  user,
  onUserDeleted,
}) => {
  const dispatch = useDispatch();
  const adminState = useSelectorAdmin((state) => state);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!user) return;

    setError(null);

    dispatch(
      adminActions.deleteUserRequest({
        data: { id: user.id },
        callback: {
          onSuccess: () => {
            if (onUserDeleted) {
              onUserDeleted();
            }
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete user';
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!adminState.deleteUserLoading) {
      setError(null);
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DialogContentText>
          Are you sure you want to delete user <strong>{user.displayName}</strong> ({user.email})?
          <br />
          <br />
          This action cannot be undone. The user will be permanently removed from the system.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={adminState.deleteUserLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={adminState.deleteUserLoading}
          startIcon={adminState.deleteUserLoading ? <CircularProgress size={16} /> : null}
        >
          {adminState.deleteUserLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserDialog;





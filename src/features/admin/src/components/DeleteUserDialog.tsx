import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
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
    <Dialog key={i18n.language} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('adminDeleteUser.title')}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DialogContentText>
          {t('adminDeleteUser.confirm', { name: user.displayName, email: user.email })}
          <br />
          <br />
          {t('adminDeleteUser.warning')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={adminState.deleteUserLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={adminState.deleteUserLoading}
          startIcon={adminState.deleteUserLoading ? <CircularProgress size={16} /> : null}
        >
          {adminState.deleteUserLoading ? t('adminDeleteUser.deleting') : t('adminDeleteUser.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserDialog;





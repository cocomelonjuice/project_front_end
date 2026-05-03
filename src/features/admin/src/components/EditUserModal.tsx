import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { adminActions, useSelectorAdmin } from '../store';
import type { AdminUser } from '../store/states';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onUserUpdated?: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onClose,
  user,
  onUserUpdated,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const adminState = useSelectorAdmin((state) => state);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    isActive: true,
  });

  useEffect(() => {
    if (open && user) {
      setError(null);
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        isActive: user.isActive ?? true,
      });
    }
  }, [open, user]);

  const handleChange = (field: string) => (event: any) => {
    const value = field === 'isActive' ? event.target.checked : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!user) return;

    // Validation
    if (!formData.displayName.trim()) {
      setError(t('adminUserForm.displayNameRequired'));
      return;
    }

    if (!formData.email.trim()) {
      setError(t('adminUserForm.emailRequired'));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError(t('adminUserForm.emailInvalid'));
      return;
    }

    setError(null);

    dispatch(
      adminActions.updateUserRequest({
        data: {
          id: user.id,
          displayName: formData.displayName.trim(),
          email: formData.email.trim(),
          isActive: formData.isActive,
        },
        callback: {
          onSuccess: () => {
            if (onUserUpdated) {
              onUserUpdated();
            }
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || t('adminUserForm.updateFailed');
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!adminState.updateUserLoading) {
      setError(null);
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('adminUserForm.editTitle')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <TextField
            label={t('adminUserForm.username')}
            fullWidth
            value={user.username}
            disabled
            helperText={t('adminUserForm.usernameDisabledHelper')}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label={t('adminUserForm.displayName')}
            required
            fullWidth
            value={formData.displayName}
            onChange={handleChange('displayName')}
            disabled={adminState.updateUserLoading}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label={t('adminUserForm.email')}
            required
            fullWidth
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            disabled={adminState.updateUserLoading}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleChange('isActive')}
                disabled={adminState.updateUserLoading}
              />
            }
            label={t('adminUserForm.active')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={adminState.updateUserLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={adminState.updateUserLoading || !formData.displayName.trim() || !formData.email.trim()}
          startIcon={adminState.updateUserLoading ? <CircularProgress size={16} /> : null}
        >
          {adminState.updateUserLoading ? t('adminUserForm.saving') : t('adminUserForm.saveChanges')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModal;





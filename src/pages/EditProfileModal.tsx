import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { adminActions, useSelectorAdmin } from '../features/admin/src/store';
import { authActions } from '../features/auth/src/store';
import type { AdminUser } from '../features/admin/src/store/states';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS } from '../shared/constants/src/ui';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onProfileUpdated?: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  user,
  onProfileUpdated,
}) => {
  const dispatch = useDispatch();
  const adminState = useSelectorAdmin((state) => state);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
  });

  useEffect(() => {
    if (open && user) {
      setError(null);
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
      });
    }
  }, [open, user]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!user) return;

    // Validation
    if (!formData.displayName.trim()) {
      setError('Display name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setError(null);

    dispatch(
      adminActions.updateUserRequest({
        data: {
          id: user.id,
          displayName: formData.displayName.trim(),
          email: formData.email.trim(),
        },
        callback: {
          onSuccess: () => {
            // Refresh user profile after update
            dispatch(authActions.getProfileRequest({} as any));
            if (onProfileUpdated) {
              onProfileUpdated();
            }
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update profile';
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: UI_BORDER_RADIUS.xl,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: UI_TYPOGRAPHY.fontSize.xl,
          fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
          color: UI_COLORS.text.primary,
        }}
      >
        Edit Profile
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <TextField
            label="Username"
            fullWidth
            value={user.username}
            disabled
            helperText="Username cannot be changed"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Display Name"
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
            label="Email"
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
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={handleClose} disabled={adminState.updateUserLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={adminState.updateUserLoading || !formData.displayName.trim() || !formData.email.trim()}
          startIcon={adminState.updateUserLoading ? <CircularProgress size={16} /> : null}
        >
          {adminState.updateUserLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;



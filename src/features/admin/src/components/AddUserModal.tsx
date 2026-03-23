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
  Typography,
} from '@mui/material';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS } from '../../../../shared/constants/src/ui';
import { adminActions, useSelectorAdmin } from '../store';
import authApi from '../../../auth/src/store/api';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserAdded?: () => void;
  existingEmails?: string[];
  existingUsernames?: string[];
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onClose,
  onUserAdded,
  existingEmails = [],
  existingUsernames = [],
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const adminState = useSelectorAdmin((state) => state);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (open) {
      setError(null);
      setFormData({
        username: '',
        email: '',
        displayName: '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [open]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (existingUsernames.includes(formData.username.toLowerCase())) {
      setError('Username already exists');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    if (existingEmails.includes(formData.email.toLowerCase())) {
      setError('Email already exists');
      return;
    }

    if (!formData.displayName.trim()) {
      setError('Display name is required');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await authApi.register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        displayName: formData.displayName.trim(),
        password: formData.password,
      });

      // Refresh users list
      dispatch(
        adminActions.getUsersRequest({
          data: {},
          callback: {
            onSuccess: () => {
              if (onUserAdded) {
                onUserAdded();
              }
              onClose();
            },
            onError: () => {
              // User was created but refresh failed - still close modal
              if (onUserAdded) {
                onUserAdded();
              }
              onClose();
            },
          },
        })
      );
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || t('adminUserForm.createFailed');
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: UI_BORDER_RADIUS.xl,
          boxShadow: UI_SHADOWS['2xl'],
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
            color: UI_COLORS.text.primary,
            fontSize: UI_TYPOGRAPHY.fontSize.xl,
          }}
        >
          {t('adminUserForm.addTitle')}
        </Typography>
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
            required
            fullWidth
            value={formData.username}
            onChange={handleChange('username')}
            disabled={loading}
            helperText="Must be at least 3 characters"
            inputProps={{ maxLength: 50 }}
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
            disabled={loading}
            inputProps={{ maxLength: 100 }}
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
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label={t('adminUserForm.password')}
            required
            fullWidth
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            disabled={loading}
            helperText={t('adminUserForm.passwordHelper')}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Confirm Password"
            required
            fullWidth
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            loading ||
            !formData.username.trim() ||
            !formData.email.trim() ||
            !formData.displayName.trim() ||
            !formData.password ||
            !formData.confirmPassword
          }
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? t('adminUserForm.creatingUser') : t('adminUserForm.createUser')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserModal;





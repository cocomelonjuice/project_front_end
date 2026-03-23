import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { authActions, useSelectorAuth } from '../features/auth/src/store';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_TRANSITIONS, UI_INPUT_STYLES, UI_BUTTON_STYLES } from '../shared/constants/src/ui';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const authState = useSelectorAuth((state) => state);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Always reset loading states when entering register page
  useEffect(() => {
    dispatch(authActions.resetLoadingStates());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && authState.isAuthenticated) {
      navigate('/');
    }
  }, [authState.isAuthenticated, navigate]);

  const validateForm = () => {
    if (!username.trim() || !email.trim() || !displayName.trim() || !password.trim()) {
      setError(t('auth.fillAllFields'));
      return false;
    }

    if (username.length < 3 || username.length > 50) {
      setError(t('auth.usernameLength'));
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('auth.invalidEmail'));
      return false;
    }

    if (displayName.length < 3 || displayName.length > 100) {
      setError(t('auth.displayNameLength'));
      return false;
    }

    if (password.length < 8 || password.length > 100) {
      setError(t('auth.passwordLength'));
      return false;
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordsMismatch'));
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    dispatch(
      authActions.registerRequest({
        data: {
          username: username.trim(),
          email: email.trim(),
          displayName: displayName.trim(),
          password,
        },
        callback: {
          onSuccess: () => {
            navigate('/');
          },
          onError: (err: any) => {
            const errorMsg = err?.response?.data?.message || err?.message || t('auth.registrationFailed');
            setError(errorMsg);
          },
        },
      } as any)
    );
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        py: 4,
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        <LanguageSwitcher variant="light" />
      </Box>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            width: '100%',
            borderRadius: UI_BORDER_RADIUS.xl,
            boxShadow: UI_SHADOWS.xl,
            border: `1px solid ${UI_COLORS.border.light}`,
            backgroundColor: UI_COLORS.background.paper,
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
                mb: 1,
                color: UI_COLORS.text.primary,
                fontSize: { xs: UI_TYPOGRAPHY.fontSize['2xl'], sm: UI_TYPOGRAPHY.fontSize['3xl'] },
              }}
            >
              {t('auth.registerTitle')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: UI_COLORS.text.secondary,
                fontSize: UI_TYPOGRAPHY.fontSize.base,
                lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
              }}
            >
              {t('auth.registerSubtitle')}
            </Typography>
          </Box>

          {/* Error Messages */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: UI_BORDER_RADIUS.md,
                backgroundColor: UI_COLORS.error.bg,
                color: UI_COLORS.error.dark,
                '& .MuiAlert-icon': {
                  color: UI_COLORS.error.main,
                },
              }}
            >
              {error}
            </Alert>
          )}

          {authState.errors && authState.errors.length > 0 && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: UI_BORDER_RADIUS.md,
                backgroundColor: UI_COLORS.error.bg,
                color: UI_COLORS.error.dark,
                '& .MuiAlert-icon': {
                  color: UI_COLORS.error.main,
                },
              }}
            >
              {authState.errors[0].msg}
            </Alert>
          )}

          {/* Form */}
          <form key={i18n.language} onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('auth.username')}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              disabled={authState.registerLoading}
              helperText={t('auth.helperUsernameLength')}
              sx={{
                mb: 2.5,
                ...UI_INPUT_STYLES.default,
                '& .MuiFormHelperText-root': {
                  fontSize: UI_TYPOGRAPHY.fontSize.xs,
                  color: UI_COLORS.text.secondary,
                },
              }}
            />

            <TextField
              fullWidth
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={authState.registerLoading}
              sx={{
                mb: 2.5,
                ...UI_INPUT_STYLES.default,
              }}
            />

            <TextField
              fullWidth
              label="Display Name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              disabled={authState.registerLoading}
              helperText="3-100 characters"
              sx={{
                mb: 2.5,
                ...UI_INPUT_STYLES.default,
                '& .MuiFormHelperText-root': {
                  fontSize: UI_TYPOGRAPHY.fontSize.xs,
                  color: UI_COLORS.text.secondary,
                },
              }}
            />

            <TextField
              fullWidth
              label={t('auth.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={authState.registerLoading}
              helperText={t('auth.helperPasswordLength')}
              sx={{
                mb: 2.5,
                ...UI_INPUT_STYLES.default,
                '& .MuiFormHelperText-root': {
                  fontSize: UI_TYPOGRAPHY.fontSize.xs,
                  color: UI_COLORS.text.secondary,
                },
              }}
            />

            <TextField
              fullWidth
              label={t('auth.confirmPassword')}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={authState.registerLoading}
              sx={{
                mb: 3,
                ...UI_INPUT_STYLES.default,
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={authState.registerLoading}
              sx={{
                py: 1.5,
                mb: 3,
                borderRadius: UI_BORDER_RADIUS.md,
                fontSize: UI_TYPOGRAPHY.fontSize.base,
                fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                textTransform: 'none',
                transition: UI_TRANSITIONS.normal,
                ...UI_BUTTON_STYLES.primary,
              }}
            >
              {authState.registerLoading ? (
                <CircularProgress size={24} sx={{ color: UI_COLORS.primary.contrast }} />
              ) : (
                t('auth.registerSubmit')
              )}
            </Button>

            {/* Footer Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  color: UI_COLORS.text.secondary,
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                }}
              >
                {t('auth.hasAccount')}{' '}
                <MuiLink
                  component={Link}
                  to="/login"
                  sx={{
                    color: UI_COLORS.primary.main,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {t('auth.signInLink')}
                </MuiLink>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;


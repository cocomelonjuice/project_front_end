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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const authState = useSelectorAuth((state) => state);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Always reset loading states when entering login page
  useEffect(() => {
    // Clear any auth errors and loading states when on login page
    dispatch(authActions.resetLoadingStates());
    dispatch(authActions.clearErrors());
    setError(null);
  }, [dispatch]);

  // Redirect if already authenticated (only check once on mount, not on every state change)
  // Removed this useEffect - it's not needed and could cause issues
  // The AuthProvider handles redirects for authenticated users

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password.trim()) {
      setError(t('auth.fillAllFields'));
      return;
    }

    dispatch(
      authActions.loginRequest({
        data: { identifier: identifier.trim(), password },
        callback: {
          onSuccess: () => {
            navigate('/');
          },
          onError: (err: any) => {
            const errorMsg = err?.response?.data?.message || err?.message || t('auth.loginFailed');
            setError(errorMsg);
            // Clear any stale tokens from localStorage on login failure
            // This prevents AuthProvider from trying to use invalid tokens
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Don't call resetLoadingStates here - loginFailure reducer already handles it
            // This prevents multiple state updates that could cause re-renders
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
              {t('auth.loginTitle')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: UI_COLORS.text.secondary,
                fontSize: UI_TYPOGRAPHY.fontSize.base,
                lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
              }}
            >
              {t('auth.loginSubtitle')}
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
              label={t('auth.usernameOrEmail')}
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoFocus
              disabled={authState.loginLoading}
              sx={{
                mb: 2.5,
                ...UI_INPUT_STYLES.default,
              }}
            />

            <TextField
              fullWidth
              label={t('auth.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={authState.loginLoading}
              sx={{
                mb: 3,
                ...UI_INPUT_STYLES.default,
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={authState.loginLoading}
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
              {authState.loginLoading ? (
                <CircularProgress size={24} sx={{ color: UI_COLORS.primary.contrast }} />
              ) : (
                t('auth.signIn')
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
                {t('auth.noAccount')}{' '}
                <MuiLink
                  component={Link}
                  to="/register"
                  sx={{
                    color: UI_COLORS.primary.main,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {t('auth.createAccountLink')}
                </MuiLink>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;


import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
import { UI_COLORS, UI_TYPOGRAPHY, UI_SPACING, UI_BORDER_RADIUS, UI_SHADOWS, UI_TRANSITIONS, UI_INPUT_STYLES, UI_BUTTON_STYLES } from '../shared/constants/src/ui';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelectorAuth((state) => state);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Always reset loading states when entering login page
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password.trim()) {
      setError('Please fill in all fields');
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
            const errorMsg = err?.response?.data?.message || err?.message || 'Login failed';
            setError(errorMsg);
          },
        },
      } as any)
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        py: 4,
      }}
    >
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
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: UI_COLORS.text.secondary,
                fontSize: UI_TYPOGRAPHY.fontSize.base,
                lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
              }}
            >
              Sign in to your account to continue
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
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username or Email"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoFocus
              disabled={authState.loginLoading || authState.getProfileLoading}
              sx={{
                mb: 2.5,
                ...UI_INPUT_STYLES.default,
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={authState.loginLoading || authState.getProfileLoading}
              sx={{
                mb: 3,
                ...UI_INPUT_STYLES.default,
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={authState.loginLoading || authState.getProfileLoading}
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
              {authState.loginLoading || authState.getProfileLoading ? (
                <CircularProgress size={24} sx={{ color: UI_COLORS.primary.contrast }} />
              ) : (
                'Sign In'
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
                Don't have an account?{' '}
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
                  Create an account
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


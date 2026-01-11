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

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      setError('Please fill in all fields');
      return false;
    }

    if (username.length < 3 || username.length > 50) {
      setError('Username must be between 3 and 50 characters');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (displayName.length < 3 || displayName.length > 100) {
      setError('Display name must be between 3 and 100 characters');
      return false;
    }

    if (password.length < 8 || password.length > 100) {
      setError('Password must be between 8 and 100 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
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
            const errorMsg = err?.response?.data?.message || err?.message || 'Registration failed';
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
              Create Account
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: UI_COLORS.text.secondary,
                fontSize: UI_TYPOGRAPHY.fontSize.base,
                lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
              }}
            >
              Join us to start managing your projects
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
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              disabled={authState.registerLoading}
              helperText="3-50 characters"
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
              label="Email"
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
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={authState.registerLoading}
              helperText="8-100 characters"
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
              label="Confirm Password"
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
                'Create Account'
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
                Already have an account?{' '}
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
                  Sign in
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


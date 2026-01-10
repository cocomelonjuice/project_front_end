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
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {authState.errors && authState.errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {authState.errors[0].msg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username or Email"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              margin="normal"
              required
              autoFocus
              disabled={authState.loginLoading || authState.getProfileLoading}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={authState.loginLoading || authState.getProfileLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={authState.loginLoading || authState.getProfileLoading}
            >
              {authState.loginLoading || authState.getProfileLoading ? <CircularProgress size={24} /> : 'Login'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <MuiLink component={Link} to="/register">
                  Register here
                </MuiLink>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;


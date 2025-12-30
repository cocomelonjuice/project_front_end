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
            Register
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
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              autoFocus
              disabled={authState.registerLoading}
              helperText="3-50 characters"
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={authState.registerLoading}
            />

            <TextField
              fullWidth
              label="Display Name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              margin="normal"
              required
              disabled={authState.registerLoading}
              helperText="3-100 characters"
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={authState.registerLoading}
              helperText="8-100 characters"
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              disabled={authState.registerLoading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={authState.registerLoading}
            >
              {authState.registerLoading ? <CircularProgress size={24} /> : 'Register'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <MuiLink component={Link} to="/login">
                  Login here
                </MuiLink>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;


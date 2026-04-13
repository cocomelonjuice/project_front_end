import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import {
  UI_COLORS,
  UI_TYPOGRAPHY,
  UI_BORDER_RADIUS,
  UI_SHADOWS,
  UI_TRANSITIONS,
  UI_INPUT_STYLES,
  UI_BUTTON_STYLES,
} from '../shared/constants/src/ui';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const authState = useSelectorAuth((state) => state);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    dispatch(authActions.resetLoadingStates());
    dispatch(authActions.clearErrors());
    setError(null);
    setInfo(null);
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError(t('auth.fillAllFields'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(t('auth.invalidEmail'));
      return;
    }

    dispatch(
      authActions.forgotPasswordRequest({
        data: { email: trimmed },
        callback: {
          onSuccess: (data: { message?: string }) => {
            setInfo(data?.message || t('auth.forgotPasswordSuccess'));
          },
          onError: (err: any) => {
            const msg =
              err?.response?.data?.message ||
              err?.message ||
              t('auth.forgotPasswordFailed');
            setError(msg);
          },
        },
      } as any),
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
        background:
          'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
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
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
              textAlign: 'center',
              mb: 1,
            }}
          >
            {t('auth.forgotPasswordTitle')}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 3 }}
          >
            {t('auth.forgotPasswordSubtitle')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {info && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setInfo(null)}>
              {info}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={authState.forgotPasswordLoading}
              sx={{ mb: 3, ...UI_INPUT_STYLES.default }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={authState.forgotPasswordLoading}
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
              {authState.forgotPasswordLoading ? (
                <CircularProgress size={24} sx={{ color: UI_COLORS.primary.contrast }} />
              ) : (
                t('auth.forgotPasswordSubmit')
              )}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <MuiLink
                component={Link}
                to="/login"
                sx={{
                  color: UI_COLORS.primary.main,
                  fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {t('auth.backToSignIn')}
              </MuiLink>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;

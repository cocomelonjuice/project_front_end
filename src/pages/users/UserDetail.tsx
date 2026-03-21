import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import {
  Email as EmailIcon,
  Work as Briefcase,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useSelectorUsers, usersActions } from '../../features/users/src/store';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS } from '../../shared/constants/src/ui';

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const usersState = useSelectorUsers((state) => state);
  const user = usersState.currentUser;
  const loading = usersState.getUserByIdLoading;
  const error = usersState.errors;

  // Fetch user when component mounts or ID changes
  useEffect(() => {
    if (id) {
      dispatch(
        usersActions.getUserByIdRequest({
          data: { id },
          callback: {
            onSuccess: () => {},
            onError: () => {},
          },
        } as any)
      );
    }
  }, [id, dispatch]);

  // Show loading state
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress sx={{ color: UI_COLORS.primary.main }} />
        </Box>
      </Container>
    );
  }

  // Show error state
  if (error && error.length > 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: UI_BORDER_RADIUS.md,
            boxShadow: UI_SHADOWS.sm,
          }}
        >
          {error[0].msg || 'Failed to load user information.'}
        </Alert>
      </Container>
    );
  }

  // Show error if no user
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: UI_BORDER_RADIUS.md,
            boxShadow: UI_SHADOWS.sm,
          }}
        >
          User not found.
        </Alert>
      </Container>
    );
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayUser = {
    id: user.id,
    full_name: user.displayName,
    email: user.email,
    username: user.username,
    avatar: getInitials(user.displayName),
    joinDate: user.createdAt || new Date().toISOString(),
    isActive: user.isActive,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
          color: UI_COLORS.text.primary,
          fontSize: { xs: UI_TYPOGRAPHY.fontSize['2xl'], md: UI_TYPOGRAPHY.fontSize['3xl'] },
        }}
      >
        User Profile
      </Typography>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: UI_BORDER_RADIUS.xl,
          boxShadow: UI_SHADOWS.lg,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Header Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Avatar
              sx={{
                width: { xs: 100, sm: 120 },
                height: { xs: 100, sm: 120 },
                fontSize: { xs: '2.5rem', sm: '3rem' },
                bgcolor: UI_COLORS.primary.main,
                boxShadow: UI_SHADOWS.md,
              }}
            >
              {displayUser.avatar}
            </Avatar>
            <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 1,
                  fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                  color: UI_COLORS.text.primary,
                  fontSize: { xs: UI_TYPOGRAPHY.fontSize.xl, md: UI_TYPOGRAPHY.fontSize['2xl'] },
                }}
              >
                {displayUser.full_name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  color: UI_COLORS.text.secondary,
                  fontSize: UI_TYPOGRAPHY.fontSize.base,
                }}
              >
                @{displayUser.username}
              </Typography>
              {!displayUser.isActive && (
                <Typography
                  variant="body2"
                  sx={{
                    color: UI_COLORS.error.main,
                    fontSize: UI_TYPOGRAPHY.fontSize.sm,
                    fontStyle: 'italic',
                  }}
                >
                  (Inactive)
                </Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ borderColor: UI_COLORS.border.light }} />

          {/* Details Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                color: UI_COLORS.text.primary,
                fontSize: UI_TYPOGRAPHY.fontSize.xl,
              }}
            >
              Personal Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon sx={{ color: UI_COLORS.text.secondary }} />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: UI_TYPOGRAPHY.fontSize.base,
                    color: UI_COLORS.text.primary,
                  }}
                >
                  <Box component="span" sx={{ fontWeight: UI_TYPOGRAPHY.fontWeight.medium }}>
                    Email:
                  </Box>{' '}
                  {displayUser.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Briefcase sx={{ color: UI_COLORS.text.secondary }} />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: UI_TYPOGRAPHY.fontSize.base,
                    color: UI_COLORS.text.primary,
                  }}
                >
                  <Box component="span" sx={{ fontWeight: UI_TYPOGRAPHY.fontWeight.medium }}>
                    Username:
                  </Box>{' '}
                  {displayUser.username}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: UI_COLORS.border.light }} />

          {/* Additional Info */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: UI_COLORS.text.secondary,
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
              }}
            >
              Member since: {new Date(displayUser.joinDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserDetail;




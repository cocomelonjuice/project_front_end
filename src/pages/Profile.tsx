import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  Button,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as Briefcase,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useSelectorAuth } from '../features/auth/src/store';
import { UI_COLORS, UI_TYPOGRAPHY, UI_SPACING, UI_BORDER_RADIUS, UI_SHADOWS, UI_BUTTON_STYLES } from '../shared/constants/src/ui';
import EditProfileModal from './EditProfileModal';
import type { AdminUser } from '../features/admin/src/store/states';

const Profile = () => {
  const authState = useSelectorAuth((state) => state);
  const user = authState.user;
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Convert auth user to AdminUser format for the modal
  const adminUser: AdminUser | null = user
    ? {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        isActive: true,
        roles: [],
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString(),
      }
    : null;

  // Show loading state
  if (authState.getProfileLoading) {
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
          Please log in to view your profile.
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
        Profile
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
              <Button
                variant="outlined"
                size="small"
                onClick={() => setEditModalOpen(true)}
                sx={{
                  ...UI_BUTTON_STYLES.secondary,
                  borderRadius: UI_BORDER_RADIUS.md,
                  px: 2.5,
                  py: 1,
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                  fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                  textTransform: 'none',
                }}
              >
                Edit Profile
              </Button>
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

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={adminUser}
        onProfileUpdated={() => {
          // Profile will be refreshed automatically via getProfile action
        }}
      />
    </Container>
  );
};

export default Profile;

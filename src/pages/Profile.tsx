import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as Briefcase,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useSelectorAuth } from '../features/auth/src/store';

const Profile = () => {
  const authState = useSelectorAuth((state) => state);
  const user = authState.user;

  // Show loading state
  if (authState.getProfileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error if no user
  if (!user) {
    return (
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 3 }}>
        <Alert severity="error">Please log in to view your profile.</Alert>
      </Box>
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
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Profile
      </Typography>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Header Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: '3rem',
                bgcolor: 'primary.main',
              }}
            >
              {displayUser.avatar}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                {displayUser.full_name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {displayUser.position}
              </Typography>
              <Button variant="outlined" size="small">
                Edit Profile
              </Button>
            </Box>
          </Box>

          <Divider />

          {/* Details Section */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Personal Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon color="action" />
                <Typography variant="body1">
                  <strong>Email:</strong> {displayUser.email}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Briefcase color="action" />
                <Typography variant="body1">
                  <strong>Username:</strong> {displayUser.username}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />


          {/* Additional Info */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Member since: {new Date(displayUser.joinDate).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;

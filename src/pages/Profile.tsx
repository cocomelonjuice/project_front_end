import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as Briefcase,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

const Profile = () => {
  // Mock user data (for testing without login)
  const mockUser = {
    id: '1',
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234-567-8900',
    position: 'Software Developer',
    department: 'Engineering',
    location: 'New York, USA',
    avatar: 'JD',
    bio: 'Experienced software developer with a passion for building great products.',
    joinDate: '2024-01-15',
  };

  const displayUser = mockUser;

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
                <PhoneIcon color="action" />
                <Typography variant="body1">
                  <strong>Phone:</strong> {displayUser.phone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Briefcase color="action" />
                <Typography variant="body1">
                  <strong>Department:</strong> {displayUser.department}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationIcon color="action" />
                <Typography variant="body1">
                  <strong>Location:</strong> {displayUser.location}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Bio Section */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              About
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {displayUser.bio}
            </Typography>
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

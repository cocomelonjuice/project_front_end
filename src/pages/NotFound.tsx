import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UI_COLORS, UI_TYPOGRAPHY, UI_SPACING, UI_BORDER_RADIUS, UI_SHADOWS, UI_BUTTON_STYLES } from '../shared/constants/src/ui';

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          py: 6,
        }}
      >
        {/* 404 Number */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
            fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
            color: UI_COLORS.primary.main,
            lineHeight: 1,
            mb: 2,
            textShadow: `0 4px 6px rgba(99, 102, 241, 0.1)`,
          }}
        >
          404
        </Typography>

        {/* Title */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
            color: UI_COLORS.text.primary,
            mb: 2,
            fontSize: { xs: UI_TYPOGRAPHY.fontSize['2xl'], md: UI_TYPOGRAPHY.fontSize['3xl'] },
          }}
        >
          Page Not Found
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            color: UI_COLORS.text.secondary,
            mb: 4,
            maxWidth: '500px',
            fontSize: UI_TYPOGRAPHY.fontSize.lg,
            lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
          }}
        >
          {t('notFound.description')}
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              ...UI_BUTTON_STYLES.primary,
              px: 3,
              py: 1.5,
              borderRadius: UI_BORDER_RADIUS.md,
              fontSize: UI_TYPOGRAPHY.fontSize.base,
              fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
              textTransform: 'none',
            }}
          >
            Go to Home
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              ...UI_BUTTON_STYLES.secondary,
              px: 3,
              py: 1.5,
              borderRadius: UI_BORDER_RADIUS.md,
              fontSize: UI_TYPOGRAPHY.fontSize.base,
              fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
              textTransform: 'none',
            }}
          >
            {t('notFound.goBack')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;

import { Box, Typography, Button } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * 401 Unauthorized Page
 * Similar to vaccine-rsa-web-v2 ui/exception
 * Uses Material-UI to match your project
 */
export const Page401 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: 4,
      }}
    >
      <LockOutlined sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
      <Typography variant="h3" component="h1" gutterBottom>
        403
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {t('errors.unauthorizedMessage')}
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{ mt: 3 }}
      >
        {t('errors.goHome')}
      </Button>
    </Box>
  );
};


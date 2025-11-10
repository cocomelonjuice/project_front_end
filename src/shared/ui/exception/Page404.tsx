import { Box, Typography, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * 404 Not Found Page
 * Similar to vaccine-rsa-web-v2 ui/exception
 * Uses Material-UI to match your project
 */
export const Page404 = () => {
  const navigate = useNavigate();

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
      <ErrorOutline sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
      <Typography variant="h3" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Sorry, the page you visited does not exist.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{ mt: 3 }}
      >
        Go Home
      </Button>
    </Box>
  );
};


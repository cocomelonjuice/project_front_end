import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  People as PeopleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../shared/auth/src';
import { Page401 } from '../../shared/ui/exception/Page401';
import UsersManagement from '../../features/admin/src/components/UsersManagement';
import SystemSettingsManagement from '../../features/admin/src/components/SystemSettingsManagement';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS } from '../../shared/constants/src/ui';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 4 }}>{children}</Box>}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { checkRole } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  // Check if user has admin role
  const isAdmin = checkRole('admin');

  // Redirect to 401 if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/401', { replace: true });
    }
  }, [isAdmin, navigate]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Show 401 page if not admin
  if (!isAdmin) {
    return <Page401 />;
  }

  return (
    <Box sx={{ p: 4, maxWidth: '1400px', mx: 'auto' }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 4,
          fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
          color: UI_COLORS.text.primary,
          fontSize: UI_TYPOGRAPHY.fontSize['2xl'],
        }}
      >
        {t('adminPage.title')}
      </Typography>

      <Paper
        sx={{
          mb: 3,
          borderRadius: UI_BORDER_RADIUS.xl,
          boxShadow: UI_SHADOWS.lg,
          border: `1px solid ${UI_COLORS.border.light}`,
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: `1px solid ${UI_COLORS.border.light}`,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: UI_TYPOGRAPHY.fontSize.base,
              fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
              minHeight: 64,
              color: UI_COLORS.text.secondary,
              '&.Mui-selected': {
                color: UI_COLORS.primary.main,
                fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
              },
              '&:hover': {
                backgroundColor: UI_COLORS.background.hover,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: UI_COLORS.primary.main,
              height: 3,
            },
          }}
        >
          <Tab
            icon={<PeopleIcon />}
            iconPosition="start"
            label={t('adminPage.tabUsers')}
            value={0}
          />
          <Tab
            icon={<SettingsIcon />}
            iconPosition="start"
            label={t('adminPage.tabSystemSettings')}
            value={1}
          />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <UsersManagement />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <SystemSettingsManagement />
      </TabPanel>
    </Box>
  );
};

export default AdminDashboard;



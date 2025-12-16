import React, { useState } from 'react';
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
import UsersManagement from '../../features/admin/src/components/UsersManagement';
import SystemSettingsManagement from '../../features/admin/src/components/SystemSettingsManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Admin Management
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<PeopleIcon />}
            iconPosition="start"
            label="Users"
            value={0}
          />
          <Tab
            icon={<SettingsIcon />}
            iconPosition="start"
            label="System Settings"
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



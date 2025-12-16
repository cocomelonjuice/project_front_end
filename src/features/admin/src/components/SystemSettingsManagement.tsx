import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  BugReport as BugReportIcon,
  LowPriority as LowPriorityIcon,
  SwapHoriz as SwapHorizIcon,
  Label as LabelIcon,
} from '@mui/icons-material';
import { mockSystemSettings } from '../store/mockData';
import type { SystemSetting } from '../store/states';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

const SystemSettingsManagement: React.FC = () => {
  const [settings, setSettings] = useState<SystemSetting[]>(mockSystemSettings);
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedSetting, setSelectedSetting] = useState<SystemSetting | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, setting: SystemSetting) => {
    setMenuAnchor(event.currentTarget);
    setSelectedSetting(setting);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedSetting(null);
  };

  const handleEdit = () => {
    // TODO: Open edit modal
    console.log('Edit setting:', selectedSetting);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedSetting) {
      setSettings((prev) => prev.filter((s) => s.id !== selectedSetting.id));
      handleMenuClose();
    }
  };

  const getSettingsByType = (type: SystemSetting['type']) => {
    return settings.filter((s) => s.type === type);
  };

  const renderTable = (typeSettings: SystemSetting[]) => {
    if (typeSettings.length === 0) {
      return <Alert severity="info">No items found. Add your first item to get started.</Alert>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              {tabValue === 1 && <TableCell>Order</TableCell>}
              {tabValue === 2 && <TableCell>Category</TableCell>}
              {tabValue === 3 && <TableCell>Color</TableCell>}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {typeSettings.map((setting) => (
              <TableRow key={setting.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {setting.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {setting.description || '-'}
                  </Typography>
                </TableCell>
                {tabValue === 1 && (
                  <TableCell>
                    <Typography variant="body2">{setting.orderNum || '-'}</Typography>
                  </TableCell>
                )}
                {tabValue === 2 && (
                  <TableCell>
                    <Chip label={setting.category || '-'} size="small" />
                  </TableCell>
                )}
                {tabValue === 3 && (
                  <TableCell>
                    {setting.color ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: setting.color,
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        />
                        <Typography variant="body2">{setting.color}</Typography>
                      </Box>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                )}
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, setting)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">System Settings</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Item
        </Button>
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<BugReportIcon />} iconPosition="start" label="Issue Types" />
          <Tab icon={<LowPriorityIcon />} iconPosition="start" label="Priorities" />
          <Tab icon={<SwapHorizIcon />} iconPosition="start" label="Statuses" />
          <Tab icon={<LabelIcon />} iconPosition="start" label="Labels" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        {renderTable(getSettingsByType('issue_type'))}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderTable(getSettingsByType('priority'))}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {renderTable(getSettingsByType('status'))}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {renderTable(getSettingsByType('label'))}
      </TabPanel>

      {/* Context Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SystemSettingsManagement;

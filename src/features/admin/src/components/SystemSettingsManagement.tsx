import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
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
  CircularProgress,
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
import { adminActions, useSelectorAdmin } from '../store';
import type { SystemSetting } from '../store/states';
import adminApi from '../store/api';
import EditIssueTypeModal from './EditIssueTypeModal';
import AddIssueTypeModal from './AddIssueTypeModal';
import EditPriorityModal from './EditPriorityModal';
import AddPriorityModal from './AddPriorityModal';
import EditStatusModal from './EditStatusModal';
import AddStatusModal from './AddStatusModal';
import { CreateLabelModal, EditLabelModal } from '../../../labels/src/components';

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
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const adminState = useSelectorAdmin((state) => state);
  const { systemSettings, getSystemSettingsLoading } = adminState;

  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedSetting, setSelectedSetting] = useState<SystemSetting | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(
      adminActions.getSystemSettingsRequest({
        data: {},
        callback: {
          onError: (error: any) => {
            console.error('Failed to load system settings:', error);
          },
        },
      })
    );
  }, [dispatch]);

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
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleAdd = () => {
    setAddModalOpen(true);
  };

  const handleRefreshSettings = () => {
    dispatch(
      adminActions.getSystemSettingsRequest({
        data: {},
        callback: {
          onError: (error: any) => {
            console.error('Failed to refresh system settings:', error);
          },
        },
      })
    );
  };

  const handleDelete = async () => {
    if (!selectedSetting) return;

    try {
      // Call appropriate delete API based on setting type
      switch (selectedSetting.type) {
        case 'issue_type':
          await adminApi.deleteIssueType(selectedSetting.id);
          break;
        case 'priority':
          await adminApi.deletePriority(selectedSetting.id);
          break;
        case 'status':
          await adminApi.deleteStatus(selectedSetting.id);
          break;
        case 'label':
          await adminApi.deleteLabel(selectedSetting.id);
          break;
      }

      // Refresh system settings
      dispatch(
        adminActions.getSystemSettingsRequest({
          data: {},
          callback: {
            onError: (error: any) => {
              console.error('Failed to refresh system settings:', error);
            },
          },
        })
      );

      handleMenuClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || t('adminSettings.deleteFailed');
      alert(errorMessage); // Simple alert for now (stage 14: toast)
    }
  };

  // Filter settings by type using Redux state data
  const getSettingsByType = (type: SystemSetting['type']) => {
    return systemSettings.filter((s) => s.type === type);
  };

  const renderTable = (typeSettings: SystemSetting[]) => {
    if (typeSettings.length === 0) {
      return <Alert severity="info">{t('adminSettings.empty')}</Alert>;
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('adminSettings.colName')}</TableCell>
              <TableCell>{t('adminSettings.colDescription')}</TableCell>
              {tabValue === 1 && <TableCell>{t('adminSettings.colOrder')}</TableCell>}
              {tabValue === 2 && <TableCell>{t('adminSettings.colCategory')}</TableCell>}
              {tabValue === 3 && <TableCell>{t('adminSettings.colColor')}</TableCell>}
              <TableCell align="right">{t('adminSettings.colActions')}</TableCell>
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

  if (getSystemSettingsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">{t('adminSettings.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          {t('adminSettings.addItem')}
        </Button>
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<BugReportIcon />} iconPosition="start" label={t('adminSettings.tabIssueTypes')} />
          <Tab icon={<LowPriorityIcon />} iconPosition="start" label={t('adminSettings.tabPriorities')} />
          <Tab icon={<SwapHorizIcon />} iconPosition="start" label={t('adminSettings.tabStatuses')} />
          <Tab icon={<LabelIcon />} iconPosition="start" label={t('adminSettings.tabLabels')} />
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
          {t('adminSettings.menuEdit')}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          {t('adminSettings.menuDelete')}
        </MenuItem>
      </Menu>

      {/* Edit Modals */}
      {tabValue === 0 && (
        <EditIssueTypeModal
          open={editModalOpen && selectedSetting?.type === 'issue_type'}
          onClose={() => setEditModalOpen(false)}
          issueType={selectedSetting?.type === 'issue_type' ? selectedSetting : null}
          onIssueTypeUpdated={handleRefreshSettings}
        />
      )}
      {tabValue === 1 && (
        <EditPriorityModal
          open={editModalOpen && selectedSetting?.type === 'priority'}
          onClose={() => setEditModalOpen(false)}
          priority={selectedSetting?.type === 'priority' ? selectedSetting : null}
          onPriorityUpdated={handleRefreshSettings}
        />
      )}
      {tabValue === 2 && (
        <EditStatusModal
          open={editModalOpen && selectedSetting?.type === 'status'}
          onClose={() => setEditModalOpen(false)}
          status={selectedSetting?.type === 'status' ? selectedSetting : null}
          onStatusUpdated={handleRefreshSettings}
        />
      )}
      {tabValue === 3 && (
        <EditLabelModal
          open={editModalOpen && selectedSetting?.type === 'label'}
          onClose={() => setEditModalOpen(false)}
          label={
            selectedSetting?.type === 'label'
              ? {
                  id: selectedSetting.id,
                  name: selectedSetting.name,
                  color: selectedSetting.color,
                  description: selectedSetting.description,
                }
              : null
          }
          onLabelUpdated={() => {
            handleRefreshSettings();
            setEditModalOpen(false);
          }}
          existingLabels={getSettingsByType('label').map((s) => ({
            id: s.id,
            name: s.name,
            color: s.color,
            description: s.description,
          }))}
        />
      )}

      {/* Add Modals */}
      {tabValue === 0 && (
        <AddIssueTypeModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onIssueTypeAdded={handleRefreshSettings}
          existingNames={getSettingsByType('issue_type').map((s) => s.name.toLowerCase())}
        />
      )}
      {tabValue === 1 && (
        <AddPriorityModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onPriorityAdded={handleRefreshSettings}
          existingNames={getSettingsByType('priority').map((s) => s.name.toLowerCase())}
        />
      )}
      {tabValue === 2 && (
        <AddStatusModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onStatusAdded={handleRefreshSettings}
          existingNames={getSettingsByType('status').map((s) => s.name.toLowerCase())}
        />
      )}
      {tabValue === 3 && (
        <CreateLabelModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onLabelCreated={() => {
            handleRefreshSettings();
            setAddModalOpen(false);
          }}
          existingLabels={getSettingsByType('label').map((s) => ({
            id: s.id,
            name: s.name,
            color: s.color,
            description: s.description,
          }))}
        />
      )}
    </Box>
  );
};

export default SystemSettingsManagement;

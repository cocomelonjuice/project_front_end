import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
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
  Avatar,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { adminActions, useSelectorAdmin } from '../store';
import type { AdminUser } from '../store/states';
import { useAuth } from '../../../../shared/auth/src';
import EditUserModal from './EditUserModal';
import AddUserModal from './AddUserModal';
import DeleteUserDialog from './DeleteUserDialog';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_BUTTON_STYLES } from '../../../../shared/constants/src/ui';

const UsersManagement: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const adminState = useSelectorAdmin((state) => state);
  const { users, getUsersLoading, updateUserLoading, deleteUserLoading, errors } = adminState;
  const { checkRole } = useAuth();
  
  // Check if user has admin role
  const isAdmin = checkRole('admin');

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    dispatch(
      adminActions.getUsersRequest({
        data: {},
        callback: {
          onError: (error: any) => {
            setSnackbar({ open: true, message: 'Failed to load users', severity: 'error' });
          },
        },
      })
    );
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: AdminUser) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleToggleActive = () => {
    if (selectedUser) {
      dispatch(
        adminActions.updateUserRequest({
          data: {
            id: selectedUser.id,
            isActive: !selectedUser.isActive,
          },
          callback: {
            onSuccess: () => {
              setSnackbar({ open: true, message: t('adminUsers.snackbarUpdateSuccess'), severity: 'success' });
              handleMenuClose();
              setSelectedUser(null);
            },
            onError: (error: any) => {
              setSnackbar({ open: true, message: 'Failed to update user', severity: 'error' });
            },
          },
        })
      );
    }
  };

  const handleEdit = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleRefreshUsers = () => {
    dispatch(
      adminActions.getUsersRequest({
        data: {},
        callback: {
          onError: (error: any) => {
            setSnackbar({ open: true, message: t('adminUsers.snackbarRefreshFailed'), severity: 'error' });
          },
        },
      })
    );
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDateDDMMYYYY = (value?: string) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getRoleChipStyle = () => ({
    bgcolor: 'rgba(59,130,246,0.12)',
    color: '#1D4ED8',
    border: '1px solid rgba(59,130,246,0.28)',
    fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
    fontSize: UI_TYPOGRAPHY.fontSize.xs,
  });

  const getStatusChipStyle = (isActive: boolean) => ({
    bgcolor: isActive ? 'rgba(34,197,94,0.14)' : 'rgba(148,163,184,0.16)',
    color: isActive ? '#166534' : '#334155',
    border: `1px solid ${isActive ? 'rgba(34,197,94,0.32)' : 'rgba(148,163,184,0.32)'}`,
    fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
    fontSize: UI_TYPOGRAPHY.fontSize.xs,
  });

  if (getUsersLoading) {
    return (
      <Paper
        sx={{
          p: 6,
          borderRadius: UI_BORDER_RADIUS.xl,
          boxShadow: UI_SHADOWS.md,
          border: `1px solid ${UI_COLORS.border.light}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 320,
        }}
      >
        <CircularProgress sx={{ color: UI_COLORS.primary.main }} />
      </Paper>
    );
  }

  if (users.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          borderRadius: UI_BORDER_RADIUS.xl,
          boxShadow: UI_SHADOWS.md,
          border: `1px solid ${UI_COLORS.border.light}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
              color: UI_COLORS.text.primary,
            }}
          >
            {t('adminUsers.title')}
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddModalOpen(true)}
              sx={{
                ...UI_BUTTON_STYLES.primary,
                borderRadius: UI_BORDER_RADIUS.md,
                textTransform: 'none',
                fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
              }}
            >
              {t('adminUsers.addUser')}
            </Button>
          )}
        </Box>
        <Alert
          severity="info"
          sx={{
            borderRadius: UI_BORDER_RADIUS.md,
            border: `1px solid ${UI_COLORS.info.light}`,
            backgroundColor: UI_COLORS.info.bg,
          }}
        >
          No users found.
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: UI_BORDER_RADIUS.xl,
        boxShadow: UI_SHADOWS.md,
        border: `1px solid ${UI_COLORS.border.light}`,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
            color: UI_COLORS.text.primary,
          }}
        >
          {t('adminUsers.title')}
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddModalOpen(true)}
            sx={{
              ...UI_BUTTON_STYLES.primary,
              borderRadius: UI_BORDER_RADIUS.md,
              textTransform: 'none',
              fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
              boxShadow: UI_SHADOWS.md,
            }}
          >
            {t('adminUsers.addUser')}
          </Button>
        )}
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: UI_BORDER_RADIUS.lg,
          border: `1px solid ${UI_COLORS.border.light}`,
          boxShadow: 'none',
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: UI_COLORS.background.subtle }}>
              <TableCell sx={{ fontWeight: UI_TYPOGRAPHY.fontWeight.semibold }}>{t('adminUsers.colUser')}</TableCell>
              <TableCell sx={{ fontWeight: UI_TYPOGRAPHY.fontWeight.semibold }}>{t('adminUsers.colEmail')}</TableCell>
              <TableCell sx={{ fontWeight: UI_TYPOGRAPHY.fontWeight.semibold }}>{t('adminUsers.colRoles')}</TableCell>
              <TableCell sx={{ fontWeight: UI_TYPOGRAPHY.fontWeight.semibold }}>{t('adminUsers.colStatus')}</TableCell>
              <TableCell sx={{ fontWeight: UI_TYPOGRAPHY.fontWeight.semibold }}>{t('adminUsers.colCreated')}</TableCell>
              <TableCell align="right" sx={{ fontWeight: UI_TYPOGRAPHY.fontWeight.semibold }}>{t('adminUsers.colActions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                hover
                sx={{
                  '&:hover': { backgroundColor: UI_COLORS.background.hover },
                  transition: 'background-color 0.2s ease-in-out',
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: UI_COLORS.primary.main }}>
                      {user.displayName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.displayName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @{user.username}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user.email}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {user.roles?.map((role) => (
                        <Chip key={role.id} label={role.name} size="small" sx={getRoleChipStyle()} />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                    size="small"
                      sx={getStatusChipStyle(user.isActive)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                      {formatDateDDMMYYYY(user.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {isAdmin && (
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                      <MoreVertIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Context Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit} disabled={updateUserLoading || deleteUserLoading}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={handleToggleActive}
          disabled={updateUserLoading || deleteUserLoading}
        >
          {selectedUser?.isActive ? (
            <>
              <BlockIcon fontSize="small" sx={{ mr: 1 }} />
              {t('adminUsers.menuDeactivate')}
            </>
          ) : (
            <>
              <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
              {t('adminUsers.menuActivate')}
            </>
          )}
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
          disabled={updateUserLoading || deleteUserLoading}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Edit User Modal */}
      <EditUserModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onUserUpdated={() => {
          handleRefreshUsers();
          setSnackbar({ open: true, message: t('adminUsers.snackbarUpdateSuccess'), severity: 'success' });
          setSelectedUser(null);
        }}
      />

      {/* Add User Modal */}
      <AddUserModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onUserAdded={() => {
          handleRefreshUsers();
          setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
        }}
        existingEmails={users.map((u) => u.email.toLowerCase())}
        existingUsernames={users.map((u) => u.username.toLowerCase())}
      />

      {/* Delete User Dialog */}
      <DeleteUserDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onUserDeleted={() => {
          handleRefreshUsers();
          setSnackbar({ open: true, message: t('adminUsers.snackbarDeleteSuccess'), severity: 'success' });
          setSelectedUser(null);
        }}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Paper>
  );
};

export default UsersManagement;

import React, { useState, useEffect } from 'react';
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

const UsersManagement: React.FC = () => {
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
    setSelectedUser(null);
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
              setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
              handleMenuClose();
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
            setSnackbar({ open: true, message: 'Failed to refresh users', severity: 'error' });
          },
        },
      })
    );
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (getUsersLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Users</Typography>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddModalOpen(true)}>
            Add User
          </Button>
        )}
      </Box>

      {users.length === 0 ? (
        <Alert severity="info">No users found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
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
                        <Chip
                          key={role.id}
                          label={role.name}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={user.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
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
      )}

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
              Deactivate
            </>
          ) : (
            <>
              <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
              Activate
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
        onClose={() => setEditModalOpen(false)}
        user={selectedUser}
        onUserUpdated={() => {
          handleRefreshUsers();
          setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
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
        onClose={() => setDeleteDialogOpen(false)}
        user={selectedUser}
        onUserDeleted={() => {
          handleRefreshUsers();
          setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
        }}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};

export default UsersManagement;

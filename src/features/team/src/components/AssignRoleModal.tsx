import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Radio,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material';
import { teamActions, useSelectorTeam } from '../store';
import { useSelectorUsers, usersActions } from '../../../users/src/store';
import type { Role, ProjectTeamMember } from '../store/states';
import type { User } from '../../../users/src/store/states';

interface AssignRoleModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  availableUsers: User[];
  availableRoles: Role[];
  existingTeamMembers: ProjectTeamMember[];
  editingMember?: ProjectTeamMember | null;
  onRoleAssigned?: (userId: string, roleId: string) => void;
}

const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  open,
  onClose,
  projectId,
  availableUsers,
  availableRoles,
  existingTeamMembers,
  editingMember,
  onRoleAssigned,
}) => {
  const dispatch = useDispatch();
  const teamState = useSelectorTeam((state) => state);
  const usersState = useSelectorUsers((state) => state);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');

  // Fetch roles and users when modal opens
  useEffect(() => {
    if (open) {
      // Always fetch roles when modal opens to ensure fresh data
      dispatch(
        teamActions.getRolesRequest({
          callback: {
            onSuccess: () => {
              // Roles loaded successfully
            },
            onError: (error: any) => {
              console.error('Failed to load roles:', error);
            },
          },
        } as any)
      );

      // Always fetch users when modal opens to ensure fresh data
      dispatch(
        usersActions.getUsersRequest({
          callback: {
            onSuccess: () => {
              // Users loaded successfully
            },
            onError: (error: any) => {
              console.error('Failed to load users:', error);
            },
          },
        } as any)
      );

      setError(null);
      setSearchQuery('');
      if (editingMember) {
        setSelectedUserId(editingMember.userId);
        setSelectedRoleId(editingMember.roleId);
      } else {
        setSelectedUserId('');
        setSelectedRoleId('');
      }
    }
  }, [open, editingMember, dispatch]);

  // Use roles from Redux state (prefer over prop)
  const roles = teamState.roles.length > 0 ? teamState.roles : availableRoles;
  
  // Use users from Redux state (prefer over prop)
  const users = usersState.users.length > 0 ? usersState.users : availableUsers;

  // Filter users based on search query and exclude already assigned users (unless editing)
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const isAlreadyAssigned = existingTeamMembers.some((m) => m.userId === user.id);
    const isEditingThisUser = editingMember && editingMember.userId === user.id;
    
    return matchesSearch && (!isAlreadyAssigned || isEditingThisUser);
  });

  const handleSubmit = () => {
    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }

    if (!selectedRoleId) {
      setError('Please select a role');
      return;
    }

    setError(null);

    dispatch(
      teamActions.assignRoleToUserInProjectRequest({
        data: {
          projectId,
          roleId: selectedRoleId,
          userId: selectedUserId,
        },
        callback: {
          onSuccess: () => {
            onRoleAssigned?.(selectedUserId, selectedRoleId);
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to assign role';
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!teamState.assignRoleLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingMember ? 'Change Role' : 'Add Team Member'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ pt: 1 }}>
          {/* User Selection */}
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, mb: 1 }}>
            Select User
          </Typography>
          <TextField
            fullWidth
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <List sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 3 }}>
            {filteredUsers.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery ? 'No users found' : 'No available users'}
                    </Typography>
                  }
                />
              </ListItem>
            ) : (
              filteredUsers.map((user) => (
                <ListItem key={user.id} disablePadding>
                  <ListItemButton
                    selected={selectedUserId === user.id}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <ListItemIcon>
                      <Radio
                        checked={selectedUserId === user.id}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={user.displayName}
                      secondary={user.email}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>

          {/* Role Selection */}
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, mb: 1 }}>
            Select Role
          </Typography>
          {teamState.getRolesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : roles.length === 0 ? (
            <Box sx={{ py: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No roles available
              </Typography>
            </Box>
          ) : (
            <List sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              {roles.map((role) => (
              <ListItem key={role.id} disablePadding>
                <ListItemButton
                  selected={selectedRoleId === role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                >
                  <ListItemIcon>
                    <Radio
                      checked={selectedRoleId === role.id}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={role.name}
                    secondary={role.description}
                  />
                </ListItemButton>
              </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={teamState.assignRoleLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={teamState.assignRoleLoading || !selectedUserId || !selectedRoleId}
          startIcon={teamState.assignRoleLoading ? <CircularProgress size={16} /> : null}
        >
          {teamState.assignRoleLoading ? 'Saving...' : editingMember ? 'Update Role' : 'Add Member'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignRoleModal;

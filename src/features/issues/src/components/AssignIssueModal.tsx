import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Radio,
  TextField,
  InputAdornment,
  Avatar,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import type { User } from '../store/states';
import { usersActions, useSelectorUsers } from '../../../users/src/store';
import { useSelectorIssues } from '../store';

interface AssignIssueModalProps {
  open: boolean;
  onClose: () => void;
  issueId: string;
  currentAssigneeId?: string;
  availableUsers?: User[];
  onIssueAssigned?: (assigneeId: string) => void;
}

const AssignIssueModal: React.FC<AssignIssueModalProps> = ({
  open,
  onClose,
  issueId,
  currentAssigneeId,
  availableUsers: propAvailableUsers,
  onIssueAssigned,
}) => {
  const dispatch = useDispatch();
  const usersState = useSelectorUsers((state) => state);
  const issuesState = useSelectorIssues((state) => state);
  const isSubmitting = issuesState.assignIssueLoading;
  const [selectedUserId, setSelectedUserId] = useState<string>(currentAssigneeId || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Use users from Redux if available, otherwise use prop (never use mockUsers in production)
  // Only use mockUsers as absolute last resort if no users are available
  const availableUsers = usersState.users.length > 0 
    ? usersState.users 
    : (propAvailableUsers || []);

  // Fetch users when modal opens (always fetch if not already loaded)
  useEffect(() => {
    if (open && usersState.users.length === 0 && !usersState.getUsersLoading) {
      dispatch(
        usersActions.getUsersRequest({
          data: {},
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
    }
  }, [open, dispatch, usersState.users.length, usersState.getUsersLoading]);

  useEffect(() => {
    if (open) {
      setSelectedUserId(currentAssigneeId || '');
      setSearchQuery('');
    }
  }, [open, currentAssigneeId]);

  // Filter users based on search query
  const filteredUsers = availableUsers.filter((user) =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (!onIssueAssigned) return;
    // Call the callback which will dispatch the Redux action
    // The parent component will handle closing the modal on success
    onIssueAssigned(selectedUserId);
  };

  const handleUnassign = () => {
    if (!onIssueAssigned) return;
    // Call the callback which will dispatch the Redux action
    // The parent component will handle closing the modal on success
    onIssueAssigned('');
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Issue</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
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

          <List sx={{ maxHeight: 400, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            {/* Unassign option */}
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedUserId === ''}
                onClick={() => setSelectedUserId('')}
              >
                <ListItemIcon>
                  <Radio
                    checked={selectedUserId === ''}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Unassigned"
                  secondary="No one assigned to this issue"
                />
              </ListItemButton>
            </ListItem>

            {/* Users list */}
            {filteredUsers.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery ? 'No users found' : 'No users available'}
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
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'primary.main',
                        mr: 2,
                        fontSize: '0.875rem',
                      }}
                    >
                      {user.displayName.charAt(0)}
                    </Avatar>
                    <ListItemText
                      primary={user.displayName}
                      secondary={user.email}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        {currentAssigneeId && (
          <Button
            onClick={handleUnassign}
            color="error"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} /> : <PersonIcon />}
          >
            Unassign
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : <PersonIcon />}
        >
          {isSubmitting ? 'Assigning...' : 'Assign'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignIssueModal;

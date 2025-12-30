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
import { mockUsers } from '../store/mockData';
import { usersActions, useSelectorUsers } from '../../../users/src/store';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>(currentAssigneeId || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Use users from Redux if available, otherwise use prop or mockUsers
  const availableUsers = propAvailableUsers || (usersState.users.length > 0 ? usersState.users : mockUsers);

  // Fetch users when modal opens
  useEffect(() => {
    if (open && usersState.users.length === 0 && !usersState.getUsersLoading && !propAvailableUsers) {
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
  }, [open, dispatch, usersState.users.length, usersState.getUsersLoading, propAvailableUsers]);

  useEffect(() => {
    if (open) {
      setSelectedUserId(currentAssigneeId || '');
      setSearchQuery('');
      setIsSubmitting(false);
    }
  }, [open, currentAssigneeId]);

  // Filter users based on search query
  const filteredUsers = availableUsers.filter((user) =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      onIssueAssigned?.(selectedUserId);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const handleUnassign = () => {
    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      onIssueAssigned?.('');
      setIsSubmitting(false);
      onClose();
    }, 300);
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

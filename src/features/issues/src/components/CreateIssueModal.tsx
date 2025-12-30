import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { mockUsers } from '../store/mockData';
import { usersActions, useSelectorUsers } from '../../../users/src/store';
import { referenceDataActions, useSelectorReferenceData } from '../../../reference-data/src/store';
import { issuesActions, useSelectorIssues } from '../store';
import { useSelectorAuth } from '../../../auth/src/store';
import type { Issue } from '../store/states';

interface CreateIssueModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  reporterId?: string;
  onIssueCreated?: (issue: Issue) => void;
}

const CreateIssueModal: React.FC<CreateIssueModalProps> = ({ open, onClose, projectId, reporterId, onIssueCreated }) => {
  const dispatch = useDispatch();
  const usersState = useSelectorUsers((state) => state);
  const referenceDataState = useSelectorReferenceData((state) => state);
  const issuesState = useSelectorIssues((state) => state);
  const authState = useSelectorAuth((state) => state);
  const [error, setError] = useState<string | null>(null);
  
  // Get current user ID from auth state, or use provided reporterId, or undefined
  const currentReporterId = authState.user?.id || reporterId || undefined;
  

  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    typeId: '',
    priorityId: '',
    statusId: '',
    assigneeId: '',
  });

  // Fetch users when modal opens
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

  // Fetch reference data on component mount (only once)
  useEffect(() => {
    // Fetch issue types
    dispatch(
      referenceDataActions.getIssueTypesRequest({
        data: {},
        callback: {
          onSuccess: () => {},
          onError: (error: any) => {
            console.error('Failed to load issue types:', error);
          },
        },
      } as any)
    );

    // Fetch priorities
    dispatch(
      referenceDataActions.getPrioritiesRequest({
        data: {},
        callback: {
          onSuccess: () => {},
          onError: (error: any) => {
            console.error('Failed to load priorities:', error);
          },
        },
      } as any)
    );

    // Fetch statuses
    dispatch(
      referenceDataActions.getStatusesRequest({
        data: {},
        callback: {
          onSuccess: () => {},
          onError: (error: any) => {
            console.error('Failed to load statuses:', error);
          },
        },
      } as any)
    );
  }, [dispatch]);

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setError(null);
      const issueTypes = referenceDataState.issueTypes;
      const priorities = referenceDataState.priorities;
      const statuses = referenceDataState.statuses;
      
      // Find medium priority (orderNum around 3) or default to first
      const mediumPriority = priorities.find((p) => p.orderNum === 3) || priorities[0];
      // Find "To Do" status or default to first
      const todoStatus = statuses.find((s) => s.category === 'todo' || s.name.toLowerCase().includes('todo')) || statuses[0];
      
      setFormData({
        summary: '',
        description: '',
        typeId: issueTypes[0]?.id || '',
        priorityId: mediumPriority?.id || '',
        statusId: todoStatus?.id || '',
        assigneeId: '',
      });
    }
  }, [open, referenceDataState.issueTypes, referenceDataState.priorities, referenceDataState.statuses]);

  const handleChange = (field: string) => (event: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.summary.trim()) {
      setError('Summary is required');
      return;
    }

    if (formData.summary.trim().length < 3) {
      setError('Summary must be at least 3 characters');
      return;
    }

    setError(null);

    // Dispatch Redux action to create issue
    dispatch(
      issuesActions.createIssueRequest({
        data: {
          projectId, // Will be extracted in saga and used in URL
          summary: formData.summary.trim(),
          description: formData.description.trim() || undefined,
          typeId: formData.typeId || undefined,
          priorityId: formData.priorityId || undefined,
          statusId: formData.statusId || undefined,
          assigneeId: formData.assigneeId || undefined,
          reporterId: currentReporterId || undefined,
        },
        callback: {
          onSuccess: (newIssue: Issue) => {
            if (onIssueCreated) {
              onIssueCreated(newIssue);
            }
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create issue';
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!issuesState.createIssueLoading) {
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>Create Issue</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Summary"
            required
            fullWidth
            value={formData.summary}
            onChange={handleChange('summary')}
            disabled={issuesState.createIssueLoading}
            placeholder="Enter issue summary"
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange('description')}
            disabled={issuesState.createIssueLoading}
            placeholder="Enter issue description (optional)"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth disabled={issuesState.createIssueLoading || referenceDataState.getIssueTypesLoading}>
              <InputLabel>Type</InputLabel>
              <Select value={formData.typeId} onChange={handleChange('typeId')} label="Type">
                {referenceDataState.issueTypes.length > 0 ? (
                  referenceDataState.issueTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.icon || ''} {type.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Loading types...</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={issuesState.createIssueLoading || referenceDataState.getPrioritiesLoading}>
              <InputLabel>Priority</InputLabel>
              <Select value={formData.priorityId} onChange={handleChange('priorityId')} label="Priority">
                {referenceDataState.priorities.length > 0 ? (
                  referenceDataState.priorities.map((priority) => (
                    <MenuItem key={priority.id} value={priority.id}>
                      {priority.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Loading priorities...</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth disabled={issuesState.createIssueLoading || referenceDataState.getStatusesLoading}>
              <InputLabel>Status</InputLabel>
              <Select value={formData.statusId} onChange={handleChange('statusId')} label="Status">
                {referenceDataState.statuses.length > 0 ? (
                  referenceDataState.statuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Loading statuses...</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={issuesState.createIssueLoading || usersState.getUsersLoading}>
              <InputLabel>Assignee</InputLabel>
              <Select value={formData.assigneeId} onChange={handleChange('assigneeId')} label="Assignee">
                <MenuItem value="">Unassigned</MenuItem>
                {(usersState.users.length > 0 ? usersState.users : mockUsers).map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={issuesState.createIssueLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={issuesState.createIssueLoading || !formData.summary.trim()}
          startIcon={issuesState.createIssueLoading ? <CircularProgress size={16} /> : null}
        >
          {issuesState.createIssueLoading ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateIssueModal;

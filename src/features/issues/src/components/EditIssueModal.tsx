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
import { issuesActions } from '../store';
import type { Issue } from '../store/states';

interface EditIssueModalProps {
  open: boolean;
  onClose: () => void;
  issue: Issue | null;
  onIssueUpdated?: (issue: Issue) => void;
}

const EditIssueModal: React.FC<EditIssueModalProps> = ({ open, onClose, issue, onIssueUpdated }) => {
  const dispatch = useDispatch();
  const usersState = useSelectorUsers((state) => state);
  const referenceDataState = useSelectorReferenceData((state) => state);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (open && issue) {
      // Reset error and pre-fill form with issue data
      setError(null);
      setIsSubmitting(false);
      setFormData({
        summary: issue.summary || '',
        description: issue.description || '',
        typeId: issue.typeId || '',
        priorityId: issue.priorityId || '',
        statusId: issue.statusId || '',
        assigneeId: issue.assigneeId || '',
      });
    }
  }, [open, issue]);

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

    if (!issue) return;

    setIsSubmitting(true);
    setError(null);

    // Dispatch Redux action to update issue via API
    dispatch(
      issuesActions.updateIssueRequest({
        data: {
          id: issue.id,
          summary: formData.summary,
          description: formData.description || undefined,
          typeId: formData.typeId,
          priorityId: formData.priorityId,
          statusId: formData.statusId,
          assigneeId: formData.assigneeId || undefined,
        },
        callback: {
          onSuccess: (updatedIssue: Issue) => {
            // Issue updated successfully
            onIssueUpdated?.(updatedIssue);
            setIsSubmitting(false);
            onClose();
          },
          onError: (error: any) => {
            console.error('Failed to update issue:', error);
            setError(error?.response?.data?.message || 'Failed to update issue. Please try again.');
            setIsSubmitting(false);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      onClose();
    }
  };

  if (!issue) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Issue: {issue.key}</DialogTitle>
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
            disabled={isSubmitting}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange('description')}
            disabled={isSubmitting}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth disabled={isSubmitting || referenceDataState.getIssueTypesLoading}>
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

            <FormControl fullWidth disabled={isSubmitting || referenceDataState.getPrioritiesLoading}>
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
            <FormControl fullWidth disabled={isSubmitting || referenceDataState.getStatusesLoading}>
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

            <FormControl fullWidth disabled={isSubmitting || usersState.getUsersLoading}>
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
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !formData.summary.trim()}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
        >
          {isSubmitting ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditIssueModal;

import React, { useState, useEffect } from 'react';
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
import { mockIssueTypes, mockPriorities, mockStatuses, mockUsers } from '../store/mockData';
import type { Issue } from '../store/states';

interface EditIssueModalProps {
  open: boolean;
  onClose: () => void;
  issue: Issue | null;
  onIssueUpdated?: (issue: Issue) => void;
}

const EditIssueModal: React.FC<EditIssueModalProps> = ({ open, onClose, issue, onIssueUpdated }) => {
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

    // Simulate a quick delay (mock API call)
    setTimeout(() => {
      // Create updated issue object
      const updatedIssue: Issue = {
        ...issue,
        summary: formData.summary,
        description: formData.description || undefined,
        typeId: formData.typeId,
        type: mockIssueTypes.find((t) => t.id === formData.typeId),
        priorityId: formData.priorityId,
        priority: mockPriorities.find((p) => p.id === formData.priorityId),
        statusId: formData.statusId,
        status: mockStatuses.find((s) => s.id === formData.statusId),
        assigneeId: formData.assigneeId || undefined,
        assignee: formData.assigneeId ? mockUsers.find((u) => u.id === formData.assigneeId) : undefined,
        updatedAt: new Date().toISOString(),
      };

      // Call the callback to update issue in parent component
      onIssueUpdated?.(updatedIssue);

      setIsSubmitting(false);
      onClose();
    }, 300); // Small delay to simulate API
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
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange('description')}
            disabled={isSubmitting}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth disabled={isSubmitting}>
              <InputLabel>Type</InputLabel>
              <Select value={formData.typeId} onChange={handleChange('typeId')} label="Type">
                {mockIssueTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={isSubmitting}>
              <InputLabel>Priority</InputLabel>
              <Select value={formData.priorityId} onChange={handleChange('priorityId')} label="Priority">
                {mockPriorities.map((priority) => (
                  <MenuItem key={priority.id} value={priority.id}>
                    {priority.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth disabled={isSubmitting}>
              <InputLabel>Status</InputLabel>
              <Select value={formData.statusId} onChange={handleChange('statusId')} label="Status">
                {mockStatuses.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={isSubmitting}>
              <InputLabel>Assignee</InputLabel>
              <Select value={formData.assigneeId} onChange={handleChange('assigneeId')} label="Assignee">
                <MenuItem value="">Unassigned</MenuItem>
                {mockUsers.map((user) => (
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

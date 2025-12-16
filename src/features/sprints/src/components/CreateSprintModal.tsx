import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import type { Sprint } from '../store/states';
import { getNextSprintId } from '../store/mockData';

interface CreateSprintModalProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
  onSprintCreated?: (sprint: Sprint) => void;
}

const CreateSprintModal: React.FC<CreateSprintModalProps> = ({
  open,
  onClose,
  boardId,
  onSprintCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setError(null);
      setIsSubmitting(false);
      setName('');
      setGoal('');
      setStartDate('');
      setEndDate('');
    }
  }, [open]);

  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      setError('Sprint name is required');
      return;
    }

    if (name.length < 3 || name.length > 100) {
      setError('Sprint name must be between 3 and 100 characters');
      return;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end <= start) {
        setError('End date must be after start date');
        return;
      }
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate API call delay
    setTimeout(() => {
      const newSprint: Sprint = {
        id: getNextSprintId(),
        name: name.trim(),
        goal: goal.trim() || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status: 'planned',
        boardId: boardId,
      };

      onSprintCreated?.(newSprint);

      // Reset form and close
      setName('');
      setGoal('');
      setStartDate('');
      setEndDate('');
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
      <DialogTitle>Create Sprint</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ pt: 1 }}>
          <TextField
            label="Sprint Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g., Sprint 1 - Authentication"
            autoFocus
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 100 }}
            helperText={`${name.length}/100 characters`}
          />

          <TextField
            label="Goal (Optional)"
            fullWidth
            multiline
            rows={3}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isSubmitting}
            placeholder="What is the goal of this sprint?"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isSubmitting}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isSubmitting}
              InputLabelProps={{
                shrink: true,
              }}
            />
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
          disabled={isSubmitting || !name.trim()}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
        >
          {isSubmitting ? 'Creating...' : 'Create Sprint'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSprintModal;

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Autocomplete,
  TextField,
  CircularProgress,
  Typography,
} from '@mui/material';
import type { WorkflowTransition, Status } from '../store/states';
import { mockStatuses } from '../../../issues/src/store/mockData';

interface AddTransitionModalProps {
  open: boolean;
  onClose: () => void;
  workflowId: string;
  existingTransitions?: WorkflowTransition[];
  onTransitionAdded?: (transition: WorkflowTransition) => void;
}

const AddTransitionModal: React.FC<AddTransitionModalProps> = ({
  open,
  onClose,
  workflowId,
  existingTransitions = [],
  onTransitionAdded,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fromStatus, setFromStatus] = useState<Status | null>(null);
  const [toStatus, setToStatus] = useState<Status | null>(null);
  const [errors, setErrors] = useState<{ fromStatus?: string; toStatus?: string }>({});

  useEffect(() => {
    if (open) {
      setFromStatus(null);
      setToStatus(null);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  const validate = (): boolean => {
    const newErrors: { fromStatus?: string; toStatus?: string } = {};
    if (!fromStatus) {
      newErrors.fromStatus = 'From status is required';
    }
    if (!toStatus) {
      newErrors.toStatus = 'To status is required';
    }
    if (fromStatus && toStatus && fromStatus.id === toStatus.id) {
      newErrors.toStatus = 'From and To status must be different';
    }
    if (
      fromStatus &&
      toStatus &&
      existingTransitions.some(
        (t) => t.fromStatusId === fromStatus.id && t.toStatusId === toStatus.id,
      )
    ) {
      newErrors.toStatus = 'This transition already exists';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !fromStatus || !toStatus) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      const newTransition: WorkflowTransition = {
        id: `t${Date.now()}`,
        workflowId,
        fromStatusId: fromStatus.id,
        fromStatus,
        toStatusId: toStatus.id,
        toStatus,
      };

      onTransitionAdded?.(newTransition);
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
      <DialogTitle>Add Transition</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Autocomplete
            options={mockStatuses}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={fromStatus}
            onChange={(_event, newValue) => {
              setFromStatus(newValue);
              setErrors((prev) => ({ ...prev, fromStatus: undefined }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="From Status"
                placeholder="Select starting status"
                variant="outlined"
                fullWidth
                error={!!errors.fromStatus}
                helperText={errors.fromStatus}
                required
              />
            )}
            disabled={isSubmitting}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              ↓
            </Typography>
          </Box>

          <Autocomplete
            options={mockStatuses}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={toStatus}
            onChange={(_event, newValue) => {
              setToStatus(newValue);
              setErrors((prev) => ({ ...prev, toStatus: undefined }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="To Status"
                placeholder="Select target status"
                variant="outlined"
                fullWidth
                error={!!errors.toStatus}
                helperText={errors.toStatus}
                required
              />
            )}
            disabled={isSubmitting}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !fromStatus || !toStatus}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
        >
          {isSubmitting ? 'Adding...' : 'Add Transition'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransitionModal;



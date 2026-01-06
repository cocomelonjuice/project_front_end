import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
  Alert,
} from '@mui/material';
import { workflowsActions, useSelectorWorkflows } from '../store';
import { useSelectorReferenceData, referenceDataActions } from '../../../reference-data/src/store';
import type { WorkflowTransition, Status } from '../store/states';

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
  const dispatch = useDispatch();
  const workflowsState = useSelectorWorkflows((state) => state);
  const referenceDataState = useSelectorReferenceData((state) => state);
  const statuses = referenceDataState.statuses;
  const [fromStatus, setFromStatus] = useState<Status | null>(null);
  const [toStatus, setToStatus] = useState<Status | null>(null);
  const [errors, setErrors] = useState<{ fromStatus?: string; toStatus?: string; general?: string }>({});

  // Fetch statuses when modal opens
  useEffect(() => {
    if (open) {
      // Always fetch statuses when modal opens to ensure fresh data
      dispatch(
        referenceDataActions.getStatusesRequest({
          data: {},
          callback: {
            onSuccess: () => {
              // Statuses loaded successfully
            },
            onError: (error: any) => {
              console.error('Failed to load statuses:', error);
            },
          },
        } as any)
      );
      
      setFromStatus(null);
      setToStatus(null);
      setErrors({});
    }
  }, [open, dispatch]);

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

    setErrors({});

    dispatch(
      workflowsActions.addTransitionRequest({
        data: {
          workflowId,
          fromStatusId: fromStatus.id,
          toStatusId: toStatus.id,
        },
        callback: {
          onSuccess: (newTransition: WorkflowTransition) => {
            onTransitionAdded?.(newTransition);
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add transition';
            setErrors({ general: errorMessage });
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!workflowsState.addTransitionLoading) {
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Transition</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {errors.general && (
            <Alert severity="error">{errors.general}</Alert>
          )}
          <Autocomplete
            options={statuses}
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
            disabled={workflowsState.addTransitionLoading}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              ↓
            </Typography>
          </Box>

          <Autocomplete
            options={statuses}
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
            disabled={workflowsState.addTransitionLoading}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={workflowsState.addTransitionLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={workflowsState.addTransitionLoading || !fromStatus || !toStatus}
          startIcon={workflowsState.addTransitionLoading ? <CircularProgress size={16} /> : null}
        >
          {workflowsState.addTransitionLoading ? 'Adding...' : 'Add Transition'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTransitionModal;



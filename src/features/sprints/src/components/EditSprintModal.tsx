import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
import { sprintsActions, useSelectorSprints } from '../store';
import type { Sprint, UpdateSprintData } from '../store/states';

interface EditSprintModalProps {
  open: boolean;
  onClose: () => void;
  sprint: Sprint | null;
  onSprintUpdated?: () => void;
}

const EditSprintModal: React.FC<EditSprintModalProps> = ({
  open,
  onClose,
  sprint,
  onSprintUpdated,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const sprintsState = useSelectorSprints((state) => state);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isSubmitting = sprintsState.updateSprintLoading;

  useEffect(() => {
    if (open && sprint) {
      // Populate form with sprint data
      setError(null);
      dispatch(sprintsActions.clearErrors());
      setName(sprint.name);
      setGoal(sprint.goal || '');
      setStartDate(sprint.startDate ? sprint.startDate.split('T')[0] : '');
      setEndDate(sprint.endDate ? sprint.endDate.split('T')[0] : '');
    }
  }, [open, sprint, dispatch]);

  // Handle errors from Redux
  useEffect(() => {
    if (sprintsState.errors && sprintsState.errors.length > 0) {
      setError(sprintsState.errors[0].msg);
    }
  }, [sprintsState.errors]);

  const handleSubmit = () => {
    if (!sprint) return;

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

    setError(null);

    const updateData: UpdateSprintData = {
      name: name.trim(),
      goal: goal.trim() || undefined,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
    };

    dispatch(
      sprintsActions.updateSprintRequest({
        data: { id: sprint.id, ...updateData },
        callback: {
          onSuccess: () => {
            onSprintUpdated?.();
            onClose();
          },
          onError: () => {
            // Error is handled by Redux state
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      dispatch(sprintsActions.clearErrors());
      onClose();
    }
  };

  if (!sprint) return null;

  return (
    <Dialog key={i18n.language} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('sprintModal.editTitle')}</DialogTitle>
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
            autoFocus
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 100 }}
            helperText={`${name.length}/100 characters`}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label={t('sprintModal.goalLabel')}
            fullWidth
            multiline
            rows={3}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isSubmitting}
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label={t('sprintModal.startDate')}
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
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !name.trim()}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
        >
          {isSubmitting ? t('sprintModal.updating') : t('sprintModal.updateSprint')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSprintModal;

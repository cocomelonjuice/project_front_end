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
  Typography,
} from '@mui/material';
import { sprintsActions, useSelectorSprints } from '../store';
import type { CreateSprintData } from '../store/states';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_INPUT_STYLES } from '../../../../shared/constants/src/ui';

interface CreateSprintModalProps {
  open: boolean;
  onClose: () => void;
  boardId: string;
  onSprintCreated?: () => void;
}

const CreateSprintModal: React.FC<CreateSprintModalProps> = ({
  open,
  onClose,
  boardId,
  onSprintCreated,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const sprintsState = useSelectorSprints((state) => state);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isSubmitting = sprintsState.createSprintLoading;

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setError(null);
      dispatch(sprintsActions.clearErrors());
      setName('');
      setGoal('');
      setStartDate('');
      setEndDate('');
    }
  }, [open, dispatch]);

  // Handle errors from Redux
  useEffect(() => {
    if (sprintsState.errors && sprintsState.errors.length > 0) {
      setError(sprintsState.errors[0].msg);
    }
  }, [sprintsState.errors]);

  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      setError(t('sprintModal.nameRequired'));
      return;
    }

    if (name.length < 3 || name.length > 100) {
      setError(t('sprintModal.nameLength'));
      return;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end <= start) {
        setError(t('sprintModal.endAfterStart'));
        return;
      }
    }

    setError(null);

    const sprintData: CreateSprintData = {
      name: name.trim(),
      goal: goal.trim() || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status: 'planned',
      boardId: boardId,
    };

    dispatch(
      sprintsActions.createSprintRequest({
        data: sprintData,
        callback: {
          onSuccess: () => {
            // Reset form and close
            setName('');
            setGoal('');
            setStartDate('');
            setEndDate('');
            onSprintCreated?.();
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

  return (
    <Dialog
      key={i18n.language}
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: UI_BORDER_RADIUS.xl,
          boxShadow: UI_SHADOWS['2xl'],
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
            color: UI_COLORS.text.primary,
            fontSize: UI_TYPOGRAPHY.fontSize.xl,
          }}
        >
          {t('sprintModal.title')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt:3 }}>
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{
                borderRadius: UI_BORDER_RADIUS.md,
                backgroundColor: UI_COLORS.error.bg,
                color: UI_COLORS.error.dark,
                '& .MuiAlert-icon': {
                  color: UI_COLORS.error.main,
                },
              }}
            >
              {error}
            </Alert>
          )}

          <TextField
            label={t('sprintModal.nameLabel')}
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            autoFocus
            inputProps={{ maxLength: 100 }}
            helperText={t('sprintModal.charCount', { current: name.length })}
            sx={UI_INPUT_STYLES.default}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
              },
            }}
            FormHelperTextProps={{
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.xs,
                color: UI_COLORS.text.secondary,
              },
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
            sx={UI_INPUT_STYLES.default}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
              },
            }}
            FormHelperTextProps={{
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.xs,
                color: UI_COLORS.text.secondary,
              },
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
              label={t('sprintModal.endDate')}
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
          {isSubmitting ? t('sprintModal.creating') : t('sprintModal.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSprintModal;

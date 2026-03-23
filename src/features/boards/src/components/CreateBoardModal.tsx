import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
  Typography,
} from '@mui/material';
import { boardsActions, useSelectorBoards } from '../store';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_INPUT_STYLES } from '../../../../shared/constants/src/ui';

interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
  onBoardCreated?: () => void;
  projectId: string;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  open,
  onClose,
  onBoardCreated,
  projectId,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const boardsState = useSelectorBoards((state) => state);
  const boardTypes = useMemo(
    () => [
      { value: 'kanban', label: t('boardModal.typeKanban') },
      { value: 'scrum', label: t('boardModal.typeScrum') },
    ],
    [t, i18n.language]
  );
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'kanban',
  });

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setError(null);
      setFormData({
        name: '',
        type: 'kanban',
      });
    }
  }, [open]);

  const handleChange = (field: string) => (event: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.name.trim()) {
      setError(t('boardModal.nameRequired'));
      return;
    }

    if (formData.name.trim().length < 3) {
      setError(t('boardModal.nameMin'));
      return;
    }

    if (formData.name.trim().length > 100) {
      setError(t('boardModal.nameMax'));
      return;
    }

    setError(null);

    // Dispatch Redux action to create board
    dispatch(
      boardsActions.createBoardRequest({
        data: {
          projectId,
          name: formData.name.trim(),
          type: formData.type,
        },
        callback: {
          onSuccess: () => {
            if (onBoardCreated) {
              onBoardCreated();
            }
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || t('boardModal.createFailed');
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!boardsState.createBoardLoading) {
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
          {t('boardModal.createTitle')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
            label={t('boardModal.nameLabel')}
            required
            fullWidth
            value={formData.name}
            onChange={handleChange('name')}
            disabled={boardsState.createBoardLoading}
            helperText={t('boardModal.nameHelper')}
            inputProps={{ maxLength: 100 }}
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

          <FormControl fullWidth required>
            <InputLabel>{t('boardModal.typeLabel')}</InputLabel>
            <Select
              value={formData.type}
              onChange={handleChange('type')}
              label={t('boardModal.typeLabel')}
              disabled={boardsState.createBoardLoading}
            >
              {boardTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={boardsState.createBoardLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={boardsState.createBoardLoading || !formData.name.trim() || formData.name.trim().length < 3}
          startIcon={boardsState.createBoardLoading ? <CircularProgress size={16} /> : null}
        >
          {boardsState.createBoardLoading ? t('boardModal.creating') : t('boardModal.createBoard')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBoardModal;





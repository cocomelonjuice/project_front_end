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
} from '@mui/material';
import { boardsActions, useSelectorBoards } from '../store';
import type { Board } from '../store/states';

interface EditBoardModalProps {
  open: boolean;
  onClose: () => void;
  onBoardUpdated?: () => void;
  board: Board | null;
}

const EditBoardModal: React.FC<EditBoardModalProps> = ({
  open,
  onClose,
  onBoardUpdated,
  board,
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
    if (open && board) {
      // Reset form when modal opens with board data
      setError(null);
      setFormData({
        name: board.name,
        type: board.type || 'kanban', // Use board type or default to kanban
      });
    }
  }, [open, board]);

  const handleChange = (field: string) => (event: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!board) return;

    // Validation
    if (!formData.name.trim()) {
      setError('Board name is required');
      return;
    }

    if (formData.name.trim().length < 3) {
      setError('Board name must be at least 3 characters');
      return;
    }

    if (formData.name.trim().length > 100) {
      setError('Board name must be at most 100 characters');
      return;
    }

    setError(null);

    // Dispatch Redux action to update board
    dispatch(
      boardsActions.updateBoardRequest({
        data: {
          id: board.id,
          name: formData.name.trim(),
          type: formData.type,
        },
        callback: {
          onSuccess: () => {
            if (onBoardUpdated) {
              onBoardUpdated();
            }
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || t('boardModal.updateFailed');
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!boardsState.updateBoardLoading) {
      onClose();
    }
  };

  if (!board) {
    return null;
  }

  return (
    <Dialog key={i18n.language} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('boardModal.editTitle')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <TextField
            label={t('boardModal.nameLabel')}
            required
            fullWidth
            value={formData.name}
            onChange={handleChange('name')}
            disabled={boardsState.updateBoardLoading}
            helperText={t('boardModal.nameHelper')}
            inputProps={{ maxLength: 100 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <FormControl fullWidth required>
            <InputLabel>{t('boardModal.typeLabel')}</InputLabel>
            <Select
              value={formData.type}
              onChange={handleChange('type')}
              label={t('boardModal.typeLabel')}
              disabled={boardsState.updateBoardLoading}
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
        <Button onClick={handleClose} disabled={boardsState.updateBoardLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={boardsState.updateBoardLoading || !formData.name.trim() || formData.name.trim().length < 3}
          startIcon={boardsState.updateBoardLoading ? <CircularProgress size={16} /> : null}
        >
          {boardsState.updateBoardLoading ? t('boardModal.saving') : t('boardModal.saveChanges')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBoardModal;


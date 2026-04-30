import React, { useState, useEffect, useMemo } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_INPUT_STYLES } from '../../../../shared/constants/src/ui';
import adminApi from '../store/api';

interface AddStatusModalProps {
  open: boolean;
  onClose: () => void;
  onStatusAdded?: () => void;
  existingNames?: string[];
}

const AddStatusModal: React.FC<AddStatusModalProps> = ({
  open,
  onClose,
  onStatusAdded,
  existingNames = [],
}) => {
  const { t, i18n } = useTranslation();
  const statusCategories = useMemo(
    () => [
      { value: 'todo', label: t('adminStatusModal.catTodo') },
      { value: 'inprogress', label: t('adminStatusModal.catInProgress') },
      { value: 'done', label: t('adminStatusModal.catDone') },
    ],
    [t],
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('todo');

  useEffect(() => {
    if (open) {
      setError(null);
      setName('');
      setCategory('todo');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(t('adminRefData.nameRequired'));
      return;
    }

    if (name.length > 50) {
      setError(t('adminRefData.nameMax50'));
      return;
    }

    if (existingNames.includes(name.trim().toLowerCase())) {
      setError(t('adminStatusModal.duplicate'));
      return;
    }

    if (!category) {
      setError(t('adminRefData.categoryRequired'));
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await adminApi.createStatus({
        name: name.trim(),
        category,
      });

      if (onStatusAdded) {
        onStatusAdded();
      }
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || t('adminStatusModal.createFailed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
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
          {t('adminStatusModal.addTitle')}
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
            label={t('adminRefData.nameLabel')}
            required
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            autoFocus
            inputProps={{ maxLength: 50 }}
            sx={UI_INPUT_STYLES.default}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
              },
            }}
          />

          <FormControl fullWidth required>
            <InputLabel>{t('adminRefData.categoryLabel')}</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label={t('adminRefData.categoryLabel')}
              disabled={loading}
            >
              {statusCategories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !name.trim()}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? t('adminRefData.creating') : t('adminStatusModal.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStatusModal;





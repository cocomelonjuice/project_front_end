import React, { useState, useEffect } from 'react';
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
import adminApi from '../store/api';
import type { SystemSetting } from '../store/states';

interface EditPriorityModalProps {
  open: boolean;
  onClose: () => void;
  priority: SystemSetting | null;
  onPriorityUpdated?: () => void;
}

const EditPriorityModal: React.FC<EditPriorityModalProps> = ({
  open,
  onClose,
  priority,
  onPriorityUpdated,
}) => {
  const { t, i18n } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [orderNum, setOrderNum] = useState<number>(1);

  useEffect(() => {
    if (open && priority) {
      setError(null);
      setName(priority.name || '');
      setOrderNum(priority.orderNum || 1);
    }
  }, [open, priority]);

  const handleSubmit = async () => {
    if (!priority) return;

    if (!name.trim()) {
      setError(t('adminRefData.nameRequired'));
      return;
    }

    if (name.length > 50) {
      setError(t('adminRefData.nameMax50'));
      return;
    }

    if (orderNum < 1) {
      setError(t('adminRefData.orderMin'));
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await adminApi.updatePriority(priority.id, {
        name: name.trim(),
        orderNum,
      });

      if (onPriorityUpdated) {
        onPriorityUpdated();
      }
      onClose();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || t('adminPriorityModal.updateFailed');
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

  if (!priority) return null;

  return (
    <Dialog key={i18n.language} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('adminPriorityModal.editTitle')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
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
            inputProps={{ maxLength: 50 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label={t('adminRefData.orderLabel')}
            required
            fullWidth
            type="number"
            value={orderNum}
            onChange={(e) => setOrderNum(parseInt(e.target.value, 10) || 1)}
            disabled={loading}
            inputProps={{ min: 1 }}
            helperText={t('adminRefData.orderHelper')}
            InputLabelProps={{
              shrink: true,
            }}
          />
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
          {loading ? t('adminRefData.saving') : t('adminRefData.saveChanges')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPriorityModal;

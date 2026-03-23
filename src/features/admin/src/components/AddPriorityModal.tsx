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
  Typography,
} from '@mui/material';
import adminApi from '../store/api';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS } from '../../../../shared/constants/src/ui';

interface AddPriorityModalProps {
  open: boolean;
  onClose: () => void;
  onPriorityAdded?: () => void;
  existingNames?: string[];
}

const AddPriorityModal: React.FC<AddPriorityModalProps> = ({
  open,
  onClose,
  onPriorityAdded,
  existingNames = [],
}) => {
  const { t, i18n } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [orderNum, setOrderNum] = useState<number>(1);

  useEffect(() => {
    if (open) {
      setError(null);
      setName('');
      setOrderNum(1);
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
      setError(t('adminPriorityModal.duplicate'));
      return;
    }

    if (orderNum < 1) {
      setError(t('adminRefData.orderMin'));
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await adminApi.createPriority({
        name: name.trim(),
        orderNum,
      });

      if (onPriorityAdded) {
        onPriorityAdded();
      }
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || t('adminPriorityModal.createFailed');
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
          {t('adminPriorityModal.addTitle')}
        </Typography>
      </DialogTitle>
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
            autoFocus
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
          {loading ? t('adminRefData.creating') : t('adminPriorityModal.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPriorityModal;





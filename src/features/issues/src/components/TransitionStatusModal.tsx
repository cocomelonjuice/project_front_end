import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Radio,
  Chip,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import type { Status } from '../store/states';
import { referenceDataActions, useSelectorReferenceData } from '../../../reference-data/src/store';

interface TransitionStatusModalProps {
  open: boolean;
  onClose: () => void;
  issueId: string;
  currentStatusId: string;
  availableStatuses?: Status[];
  onStatusTransitioned?: (statusId: string) => void;
}

const TransitionStatusModal: React.FC<TransitionStatusModalProps> = ({
  open,
  onClose,
  issueId,
  currentStatusId,
  availableStatuses,
  onStatusTransitioned,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const referenceDataState = useSelectorReferenceData((state) => state);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string>(currentStatusId);

  // Use provided statuses or fetch from API
  const statuses = availableStatuses || referenceDataState.statuses.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    color: s.color,
  })) as Status[];

  // Fetch statuses on component mount if not provided (only once)
  useEffect(() => {
    if (!availableStatuses) {
      dispatch(
        referenceDataActions.getStatusesRequest({
          data: {},
          callback: {
            onSuccess: () => {},
            onError: (error: any) => {
              console.error('Failed to load statuses:', error);
            },
          },
        } as any)
      );
    }
  }, [dispatch, availableStatuses]);

  useEffect(() => {
    if (open) {
      setSelectedStatusId(currentStatusId);
      setIsSubmitting(false);
    }
  }, [open, currentStatusId]);

  const handleSubmit = () => {
    if (selectedStatusId === currentStatusId) {
      onClose();
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      onStatusTransitioned?.(selectedStatusId);
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
    <Dialog key={i18n.language} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('transitionStatusModal.title')}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {referenceDataState.getStatusesLoading && !availableStatuses ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <List sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              {statuses.map((status) => (
              <ListItem key={status.id} disablePadding>
                <ListItemButton
                  selected={selectedStatusId === status.id}
                  onClick={() => setSelectedStatusId(status.id)}
                  disabled={status.id === currentStatusId}
                >
                  <ListItemIcon>
                    <Radio
                      checked={selectedStatusId === status.id}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={status.name}
                          size="small"
                          sx={{
                            bgcolor: status.color || '#ccc',
                            color: 'white',
                            fontWeight: status.id === currentStatusId ? 600 : 400,
                          }}
                        />
                        {status.id === currentStatusId && (
                          <Typography variant="caption" color="text.secondary">
                            {t('transitionStatusModal.current')}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={status.category ? t('transitionStatusModal.category', { category: status.category }) : undefined}
                  />
                </ListItemButton>
              </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || selectedStatusId === currentStatusId}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
        >
          {isSubmitting ? t('transitionStatusModal.changing') : t('transitionStatusModal.changeStatus')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransitionStatusModal;


import React, { useState, useEffect } from 'react';
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
import { mockStatuses } from '../store/mockData';

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
  availableStatuses = mockStatuses,
  onStatusTransitioned,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string>(currentStatusId);

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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Status</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <List sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            {availableStatuses.map((status) => (
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
                            (Current)
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={status.category && `Category: ${status.category}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || selectedStatusId === currentStatusId}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
        >
          {isSubmitting ? 'Changing...' : 'Change Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransitionStatusModal;


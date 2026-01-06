import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import LabelChip from './LabelChip';
import labelsApi from '../store/api';
import type { Label } from '../store/states';

interface AssignLabelsModalProps {
  open: boolean;
  onClose: () => void;
  issueId: string;
  availableLabels: Label[];
  assignedLabelIds: string[];
  onLabelsAssigned?: (labelIds: string[]) => void;
  onCreateLabel?: () => void; // Callback to open create label modal
}

const AssignLabelsModal: React.FC<AssignLabelsModalProps> = ({
  open,
  onClose,
  issueId,
  availableLabels,
  assignedLabelIds,
  onLabelsAssigned,
  onCreateLabel,
}) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (open) {
      // Initialize with currently assigned labels
      setSelectedLabelIds([...assignedLabelIds]);
      setSearchQuery('');
      setError(null);
    }
  }, [open, assignedLabelIds]);

  const handleToggleLabel = (labelId: string) => {
    setSelectedLabelIds((prev) => {
      if (prev.includes(labelId)) {
        return prev.filter((id) => id !== labelId);
      } else {
        return [...prev, labelId];
      }
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Calculate which labels to add and remove
      const labelsToAdd = selectedLabelIds.filter((id) => !assignedLabelIds.includes(id));
      const labelsToRemove = assignedLabelIds.filter((id) => !selectedLabelIds.includes(id));

      // Add labels to issue
      for (const labelId of labelsToAdd) {
        await labelsApi.addLabelToIssue(issueId, labelId);
      }

      // Remove labels from issue
      for (const labelId of labelsToRemove) {
        await labelsApi.removeLabelFromIssue(issueId, labelId);
      }

      // Call callback with new label IDs
      onLabelsAssigned?.(selectedLabelIds);
      onClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update labels';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Filter labels based on search query
  const filteredLabels = availableLabels.filter((label) =>
    label.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Labels</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ pt: 1 }}>
          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search labels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          {/* Create New Label Button */}
          {onCreateLabel && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onCreateLabel}
              sx={{ mb: 2 }}
            >
              Create New Label
            </Button>
          )}

          {/* Currently Assigned Labels */}
          {selectedLabelIds.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Selected ({selectedLabelIds.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedLabelIds.map((labelId) => {
                  const label = availableLabels.find((l) => l.id === labelId);
                  return label ? (
                    <LabelChip
                      key={labelId}
                      label={label}
                      onDelete={() => handleToggleLabel(labelId)}
                    />
                  ) : null;
                })}
              </Box>
            </Box>
          )}

          {/* Labels List */}
          {filteredLabels.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                {searchQuery ? 'No labels found matching your search' : 'No labels available'}
              </Typography>
            </Box>
          ) : (
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {filteredLabels.map((label) => {
                const isSelected = selectedLabelIds.includes(label.id);
                return (
                  <ListItem key={label.id} disablePadding>
                    <ListItemButton onClick={() => handleToggleLabel(label.id)}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={isSelected}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LabelChip label={label} size="small" />
                            {label.description && (
                              <Typography variant="caption" color="text.secondary">
                                {label.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignLabelsModal;

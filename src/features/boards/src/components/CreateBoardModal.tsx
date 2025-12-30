import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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

interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
  onBoardCreated?: () => void;
  projectId: string;
}

const boardTypes = [
  { value: 'kanban', label: 'Kanban' },
  { value: 'scrum', label: 'Scrum' },
];

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  open,
  onClose,
  onBoardCreated,
  projectId,
}) => {
  const dispatch = useDispatch();
  const boardsState = useSelectorBoards((state) => state);
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
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create board';
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Board</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <TextField
            label="Board Name"
            required
            fullWidth
            value={formData.name}
            onChange={handleChange('name')}
            disabled={boardsState.createBoardLoading}
            placeholder="Enter board name"
            helperText="A descriptive name for your board (3-100 characters)"
            inputProps={{ maxLength: 100 }}
          />

          <FormControl fullWidth required>
            <InputLabel>Board Type</InputLabel>
            <Select
              value={formData.type}
              onChange={handleChange('type')}
              label="Board Type"
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
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={boardsState.createBoardLoading || !formData.name.trim() || formData.name.trim().length < 3}
          startIcon={boardsState.createBoardLoading ? <CircularProgress size={16} /> : null}
        >
          {boardsState.createBoardLoading ? 'Creating...' : 'Create Board'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBoardModal;





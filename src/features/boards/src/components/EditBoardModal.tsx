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
import type { Board } from '../store/states';

interface EditBoardModalProps {
  open: boolean;
  onClose: () => void;
  onBoardUpdated?: () => void;
  board: Board | null;
}

const boardTypes = [
  { value: 'kanban', label: 'Kanban' },
  { value: 'scrum', label: 'Scrum' },
];

const EditBoardModal: React.FC<EditBoardModalProps> = ({
  open,
  onClose,
  onBoardUpdated,
  board,
}) => {
  const dispatch = useDispatch();
  const boardsState = useSelectorBoards((state) => state);
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
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update board';
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Board</DialogTitle>
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
            disabled={boardsState.updateBoardLoading}
            helperText="A descriptive name for your board (3-100 characters)"
            inputProps={{ maxLength: 100 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <FormControl fullWidth required>
            <InputLabel>Board Type</InputLabel>
            <Select
              value={formData.type}
              onChange={handleChange('type')}
              label="Board Type"
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
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={boardsState.updateBoardLoading || !formData.name.trim() || formData.name.trim().length < 3}
          startIcon={boardsState.updateBoardLoading ? <CircularProgress size={16} /> : null}
        >
          {boardsState.updateBoardLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBoardModal;


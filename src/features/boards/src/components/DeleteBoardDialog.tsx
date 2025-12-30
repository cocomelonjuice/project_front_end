import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { boardsActions, useSelectorBoards } from '../store';
import type { Board } from '../store/states';

interface DeleteBoardDialogProps {
  open: boolean;
  onClose: () => void;
  onBoardDeleted?: () => void;
  board: Board | null;
}

const DeleteBoardDialog: React.FC<DeleteBoardDialogProps> = ({
  open,
  onClose,
  onBoardDeleted,
  board,
}) => {
  const dispatch = useDispatch();
  const boardsState = useSelectorBoards((state) => state);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!board) return;

    setError(null);

    // Dispatch Redux action to delete board
    dispatch(
      boardsActions.deleteBoardRequest({
        data: {
          id: board.id,
        },
        callback: {
          onSuccess: () => {
            if (onBoardDeleted) {
              onBoardDeleted();
            }
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete board';
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!boardsState.deleteBoardLoading) {
      setError(null);
      onClose();
    }
  };

  if (!board) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Board</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <DialogContentText>
          Are you sure you want to delete the board <strong>"{board.name}"</strong>?
        </DialogContentText>
        <DialogContentText sx={{ mt: 1, color: 'warning.main' }}>
          This action cannot be undone. All sprints associated with this board will also be deleted.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={boardsState.deleteBoardLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={boardsState.deleteBoardLoading}
          startIcon={boardsState.deleteBoardLoading ? <CircularProgress size={16} /> : null}
        >
          {boardsState.deleteBoardLoading ? 'Deleting...' : 'Delete Board'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBoardDialog;





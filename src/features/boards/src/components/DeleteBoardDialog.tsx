import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
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
    <Dialog key={i18n.language} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('boardModal.deleteTitle')}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <DialogContentText>
          {t('boardModal.deleteConfirm', { name: board.name })}
        </DialogContentText>
        <DialogContentText sx={{ mt: 1, color: 'warning.main' }}>
          {t('boardModal.deleteWarning')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={boardsState.deleteBoardLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={boardsState.deleteBoardLoading}
          startIcon={boardsState.deleteBoardLoading ? <CircularProgress size={16} /> : null}
        >
          {boardsState.deleteBoardLoading ? t('boardModal.deleting') : t('boardModal.deleteBoard')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBoardDialog;





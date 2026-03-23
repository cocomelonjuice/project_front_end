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
  CircularProgress,
  Alert,
} from '@mui/material';
import { commentsActions, useSelectorComments } from '../store';
import type { Comment } from '../store/states';

interface DeleteCommentDialogProps {
  open: boolean;
  onClose: () => void;
  comment: Comment | null;
  onCommentDeleted?: (commentId: string) => void;
}

const DeleteCommentDialog: React.FC<DeleteCommentDialogProps> = ({
  open,
  onClose,
  comment,
  onCommentDeleted,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const commentsState = useSelectorComments((state) => state);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!comment) return;

    setError(null);

    dispatch(
      commentsActions.deleteCommentRequest({
        data: {
          id: comment.id,
        },
        callback: {
          onSuccess: () => {
            onCommentDeleted?.(comment.id);
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete comment';
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!commentsState.deleteCommentLoading) {
      setError(null);
      onClose();
    }
  };

  if (!comment) return null;

  return (
    <Dialog key={i18n.language} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('commentDeleteDialog.title')}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DialogContentText>
          {t('commentDeleteDialog.confirm')}
          <br />
          <br />
          {t('commentDeleteDialog.warning')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={commentsState.deleteCommentLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={commentsState.deleteCommentLoading}
          startIcon={commentsState.deleteCommentLoading ? <CircularProgress size={16} /> : null}
        >
          {commentsState.deleteCommentLoading
            ? t('commentDeleteDialog.deleting')
            : t('commentDeleteDialog.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCommentDialog;

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
import { commentsActions, useSelectorComments } from '../store';
import type { Comment } from '../store/states';

interface EditCommentModalProps {
  open: boolean;
  onClose: () => void;
  comment: Comment | null;
  onCommentUpdated?: (comment: Comment) => void;
}

const EditCommentModal: React.FC<EditCommentModalProps> = ({
  open,
  onClose,
  comment,
  onCommentUpdated,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const commentsState = useSelectorComments((state) => state);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (open && comment) {
      // Reset error and pre-fill form with comment data
      setError(null);
      setContent(comment.content || '');
    }
  }, [open, comment]);

  const handleSubmit = () => {
    if (!content.trim()) {
      setError(t('commentModal.contentRequired'));
      return;
    }

    if (!comment) return;

    setError(null);

    dispatch(
      commentsActions.updateCommentRequest({
        data: {
          id: comment.id,
          content: content.trim(),
        },
        callback: {
          onSuccess: (updatedComment: Comment) => {
            onCommentUpdated?.(updatedComment);
            onClose();
          },
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.message || error?.message || t('commentModal.updateFailed');
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!commentsState.updateCommentLoading) {
      setError(null);
      onClose();
    }
  };

  if (!comment) return null;

  return (
    <Dialog key={i18n.language} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('commentModal.editTitle')}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ pt: 1 }}>
          <TextField
            label={t('commentModal.contentLabel')}
            fullWidth
            multiline
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={commentsState.updateCommentLoading}
            autoFocus
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={commentsState.updateCommentLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={commentsState.updateCommentLoading || !content.trim()}
          startIcon={commentsState.updateCommentLoading ? <CircularProgress size={16} /> : null}
        >
          {commentsState.updateCommentLoading
            ? t('commentModal.updating')
            : t('commentModal.updateComment')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCommentModal;

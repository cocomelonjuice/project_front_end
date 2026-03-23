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
import { useSelectorAuth } from '../../../auth/src/store';

interface CreateCommentModalProps {
  open: boolean;
  onClose: () => void;
  issueId: string;
  authorId?: string;
  onCommentCreated?: (comment: any) => void;
}

const CreateCommentModal: React.FC<CreateCommentModalProps> = ({
  open,
  onClose,
  issueId,
  authorId,
  onCommentCreated,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const authState = useSelectorAuth((state) => state);
  const currentUser = authState.user;
  const commentsState = useSelectorComments((state) => state);
  
  // Get authorId from current user if not provided
  const finalAuthorId = authorId || currentUser?.id || '';
  
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setError(null);
      setContent('');
    }
  }, [open]);

  const handleSubmit = () => {
    if (!content.trim()) {
      setError(t('commentModal.contentRequired'));
      return;
    }

    if (!finalAuthorId) {
      setError(t('commentModal.notAuthenticated'));
      return;
    }

    setError(null);

    dispatch(
      commentsActions.createCommentRequest({
        data: {
          issueId,
          authorId: finalAuthorId,
          content: content.trim(),
        },
        callback: {
          onSuccess: (comment: any) => {
            onCommentCreated?.(comment);
            setContent('');
            onClose();
          },
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.message || error?.message || t('commentModal.createFailed');
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!commentsState.createCommentLoading) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog key={i18n.language} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('commentModal.createTitle')}</DialogTitle>
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
            disabled={commentsState.createCommentLoading}
            autoFocus
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={commentsState.createCommentLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={commentsState.createCommentLoading || !content.trim()}
          startIcon={commentsState.createCommentLoading ? <CircularProgress size={16} /> : null}
        >
          {commentsState.createCommentLoading ? t('commentModal.posting') : t('commentModal.postComment')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCommentModal;

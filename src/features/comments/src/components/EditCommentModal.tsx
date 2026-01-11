import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
      setError('Comment content is required');
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
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update comment';
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Comment</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ pt: 1 }}>
          <TextField
            label="Comment"
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
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={commentsState.updateCommentLoading || !content.trim()}
          startIcon={commentsState.updateCommentLoading ? <CircularProgress size={16} /> : null}
        >
          {commentsState.updateCommentLoading ? 'Updating...' : 'Update Comment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCommentModal;

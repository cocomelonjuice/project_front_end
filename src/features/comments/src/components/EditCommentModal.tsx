import React, { useState, useEffect } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (open && comment) {
      // Reset error and pre-fill form with comment data
      setError(null);
      setIsSubmitting(false);
      setContent(comment.content || '');
    }
  }, [open, comment]);

  const handleSubmit = () => {
    if (!content.trim()) {
      setError('Comment content is required');
      return;
    }

    if (!comment) return;

    setIsSubmitting(true);
    setError(null);

    // Simulate a quick delay (mock API call)
    setTimeout(() => {
      // Create updated comment object
      const updatedComment: Comment = {
        ...comment,
        content: content.trim(),
        updatedAt: new Date().toISOString(),
      };

      // Call the callback to update comment in parent component
      onCommentUpdated?.(updatedComment);

      setIsSubmitting(false);
      onClose();
    }, 300); // Small delay to simulate API
  };

  const handleClose = () => {
    if (!isSubmitting) {
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
            disabled={isSubmitting}
            placeholder="Write a comment..."
            autoFocus
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !content.trim()}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
        >
          {isSubmitting ? 'Updating...' : 'Update Comment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCommentModal;

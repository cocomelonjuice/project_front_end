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
  authorId = '1',
  onCommentCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setError(null);
      setIsSubmitting(false);
      setContent('');
    }
  }, [open]);

  const handleSubmit = () => {
    if (!content.trim()) {
      setError('Comment content is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate a quick delay (mock API call)
    setTimeout(() => {
      // Create new comment object
      const newComment = {
        id: `comment-${Date.now()}`,
        content: content.trim(),
        authorId: authorId,
        author: {
          id: authorId,
          username: 'current.user',
          email: 'current@example.com',
          displayName: 'Current User',
        },
        issueId: issueId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Call the callback to add comment to parent component
      onCommentCreated?.(newComment);

      // Reset form and close
      setContent('');
      setIsSubmitting(false);
      onClose();
    }, 300); // Small delay to simulate API
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Comment</DialogTitle>
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
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCommentModal;

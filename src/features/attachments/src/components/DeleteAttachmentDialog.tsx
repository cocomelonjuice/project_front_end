import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import { InsertDriveFile as FileIcon } from '@mui/icons-material';
import type { Attachment } from '../store/states';
import { formatFileSize } from '../store/mockData';

interface DeleteAttachmentDialogProps {
  open: boolean;
  onClose: () => void;
  attachment: Attachment | null;
  onAttachmentDeleted?: (attachmentId: string) => void;
}

const DeleteAttachmentDialog: React.FC<DeleteAttachmentDialogProps> = ({
  open,
  onClose,
  attachment,
  onAttachmentDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!attachment) return;

    setIsDeleting(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Call callback to remove from list
      if (onAttachmentDeleted) {
        onAttachmentDeleted(attachment.id);
      }

      // Close dialog
      onClose();
    } catch (err) {
      setError('Failed to delete attachment. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError(null);
      onClose();
    }
  };

  if (!attachment) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Attachment</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FileIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
              {attachment.originalFilename}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatFileSize(attachment.size)}
            </Typography>
          </Box>
        </Box>

        <DialogContentText>
          Are you sure you want to delete this attachment?
          <br />
          <br />
          This action cannot be undone. The file will be permanently removed.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={16} /> : null}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAttachmentDialog;

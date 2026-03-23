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
  Box,
  Typography,
} from '@mui/material';
import { InsertDriveFile as FileIcon } from '@mui/icons-material';
import { attachmentsActions, useSelectorAttachments } from '../store';
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
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const attachmentsState = useSelectorAttachments((state) => state);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!attachment) return;

    setError(null);

    dispatch(
      attachmentsActions.deleteAttachmentRequest({
        data: {
          id: attachment.id,
        },
        callback: {
          onSuccess: () => {
            onAttachmentDeleted?.(attachment.id);
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete attachment';
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!attachmentsState.deleteAttachmentLoading) {
      setError(null);
      onClose();
    }
  };

  if (!attachment) return null;

  return (
    <Dialog key={i18n.language} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('deleteAttachmentDialog.title')}</DialogTitle>
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
          {t('deleteAttachmentDialog.confirm')}
          <br />
          <br />
          {t('deleteAttachmentDialog.warning')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={attachmentsState.deleteAttachmentLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={attachmentsState.deleteAttachmentLoading}
          startIcon={attachmentsState.deleteAttachmentLoading ? <CircularProgress size={16} /> : null}
        >
          {attachmentsState.deleteAttachmentLoading
            ? t('deleteAttachmentDialog.deleting')
            : t('deleteAttachmentDialog.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAttachmentDialog;

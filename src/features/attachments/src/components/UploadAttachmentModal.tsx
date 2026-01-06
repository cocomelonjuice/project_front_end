import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { attachmentsActions, useSelectorAttachments } from '../store';
import { useSelectorAuth } from '../../../auth/src/store';
import type { Attachment } from '../store/states';
import { formatFileSize } from '../store/mockData';

interface UploadAttachmentModalProps {
  open: boolean;
  onClose: () => void;
  issueId: string;
  uploadedById?: string;
  onAttachmentUploaded?: (attachment: Attachment) => void;
}

const UploadAttachmentModal: React.FC<UploadAttachmentModalProps> = ({
  open,
  onClose,
  issueId,
  uploadedById,
  onAttachmentUploaded,
}) => {
  const dispatch = useDispatch();
  const authState = useSelectorAuth((state) => state);
  const currentUser = authState.user;
  const attachmentsState = useSelectorAttachments((state) => state);
  
  // Get uploadedById from current user if not provided
  const finalUploadedById = uploadedById || currentUser?.id || '';
  
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setError(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (e.g., max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError(`File size exceeds the maximum limit of ${formatFileSize(maxSize)}`);
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    if (!finalUploadedById) {
      setError('User not authenticated');
      return;
    }

    setError(null);

    dispatch(
      attachmentsActions.uploadAttachmentRequest({
        data: {
          issueId,
          file: selectedFile,
          uploadedById: finalUploadedById,
        },
        callback: {
          onSuccess: (attachment: Attachment) => {
            onAttachmentUploaded?.(attachment);
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to upload attachment';
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!attachmentsState.uploadAttachmentLoading) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Attachment</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ pt: 1 }}>
          {!selectedFile ? (
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                Click to select a file
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maximum file size: 10MB
              </Typography>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileSelect}
                disabled={attachmentsState.uploadAttachmentLoading}
              />
            </Box>
          ) : (
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <FileIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={handleRemoveFile}
                disabled={attachmentsState.uploadAttachmentLoading}
                color="error"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={attachmentsState.uploadAttachmentLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={attachmentsState.uploadAttachmentLoading || !selectedFile}
          startIcon={attachmentsState.uploadAttachmentLoading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
        >
          {attachmentsState.uploadAttachmentLoading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadAttachmentModal;

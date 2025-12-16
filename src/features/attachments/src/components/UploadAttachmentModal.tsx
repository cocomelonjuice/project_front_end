import React, { useState, useEffect, useRef } from 'react';
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
import type { Attachment } from '../store/states';
import { formatFileSize, getNextAttachmentId } from '../store/mockData';
import { mockUsers } from '../../../issues/src/store/mockData';

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
  uploadedById = '1',
  onAttachmentUploaded,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setError(null);
      setIsSubmitting(false);
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

    setIsSubmitting(true);
    setError(null);

    // Simulate file upload delay
    setTimeout(() => {
      // Create new attachment object
      const newAttachment: Attachment = {
        id: getNextAttachmentId(),
        filename: `${Date.now()}-${Math.random().toString(36).substring(7)}${selectedFile.name.substring(selectedFile.name.lastIndexOf('.'))}`,
        originalFilename: selectedFile.name,
        mimeType: selectedFile.type || 'application/octet-stream',
        size: selectedFile.size,
        filePath: `/uploads/${Date.now()}-${Math.random().toString(36).substring(7)}${selectedFile.name.substring(selectedFile.name.lastIndexOf('.'))}`,
        issueId: issueId,
        uploadedById: uploadedById,
        uploadedBy: mockUsers.find((u) => u.id === uploadedById) || mockUsers[0],
        createdAt: new Date().toISOString(),
      };

      // Call the callback to add attachment to parent component
      onAttachmentUploaded?.(newAttachment);

      // Reset form and close
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsSubmitting(false);
      onClose();
    }, 500); // Simulate upload delay
  };

  const handleClose = () => {
    if (!isSubmitting) {
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                color="error"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !selectedFile}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : <CloudUploadIcon />}
        >
          {isSubmitting ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadAttachmentModal;

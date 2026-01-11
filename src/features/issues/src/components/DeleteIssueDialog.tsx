import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Box,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { issuesActions } from '../store';
import type { Issue } from '../store/states';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_TRANSITIONS } from '../../../../shared/constants/src/ui';

interface DeleteIssueDialogProps {
  open: boolean;
  onClose: () => void;
  issue: Issue | null;
  onIssueDeleted?: (issueId: string) => void;
}

const DeleteIssueDialog: React.FC<DeleteIssueDialogProps> = ({
  open,
  onClose,
  issue,
  onIssueDeleted,
}) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!issue) return;

    setIsDeleting(true);
    setError(null);

    // Dispatch Redux action to delete issue via API
    dispatch(
      issuesActions.deleteIssueRequest({
        data: { id: issue.id },
        callback: {
          onSuccess: () => {
            // Issue deleted successfully
            onIssueDeleted?.(issue.id);
            setIsDeleting(false);
            onClose();
          },
          onError: (error: any) => {
            console.error('Failed to delete issue:', error);
            setError(error?.response?.data?.message || 'Failed to delete issue. Please try again.');
            setIsDeleting(false);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError(null);
      onClose();
    }
  };

  if (!issue) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: UI_BORDER_RADIUS.xl,
          boxShadow: UI_SHADOWS['2xl'],
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          // borderBottom: `1px solid ${UI_COLORS.border.light}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningIcon
            sx={{
              color: UI_COLORS.error.main,
              fontSize: 28,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
              color: UI_COLORS.text.primary,
              fontSize: UI_TYPOGRAPHY.fontSize.xl,
            }}
          >
            Delete Issue
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 4 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: UI_BORDER_RADIUS.md,
              backgroundColor: UI_COLORS.error.bg,
              color: UI_COLORS.error.dark,
              '& .MuiAlert-icon': {
                color: UI_COLORS.error.main,
              },
            }}
          >
            {error}
          </Alert>
        )}

        <DialogContentText
          sx={{
            color: UI_COLORS.text.primary,
            fontSize: UI_TYPOGRAPHY.fontSize.base,
            lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
            mb: 2,
          }}
        >
          Are you sure you want to delete issue <strong style={{ color: UI_COLORS.text.primary }}>{issue.key}</strong>?
        </DialogContentText>
        <DialogContentText
          sx={{
            color: UI_COLORS.text.secondary,
            fontSize: UI_TYPOGRAPHY.fontSize.sm,
            lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
          }}
        >
          This action cannot be undone. All comments, attachments, and history associated with this
          issue will be permanently deleted.
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2.5,
          borderTop: `1px solid ${UI_COLORS.border.light}`,
          gap: 1.5,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isDeleting}
          sx={{
            textTransform: 'none',
            fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
            color: UI_COLORS.text.secondary,
            '&:hover': {
              backgroundColor: UI_COLORS.background.hover,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={16} sx={{ color: UI_COLORS.primary.contrast }} /> : null}
          sx={{
            textTransform: 'none',
            fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
            borderRadius: UI_BORDER_RADIUS.md,
            px: 3,
            transition: UI_TRANSITIONS.normal,
            backgroundColor: UI_COLORS.error.main,
            color: UI_COLORS.primary.contrast,
            '&:hover': {
              backgroundColor: UI_COLORS.error.dark,
              boxShadow: UI_SHADOWS.md,
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              backgroundColor: UI_COLORS.border.light,
              color: UI_COLORS.text.disabled,
            },
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete Issue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteIssueDialog;

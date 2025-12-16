import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import type { Workflow } from '../store/states';

interface DeleteWorkflowDialogProps {
  open: boolean;
  onClose: () => void;
  workflow: Workflow | null;
  onWorkflowDeleted?: (workflowId: string) => void;
}

const DeleteWorkflowDialog: React.FC<DeleteWorkflowDialogProps> = ({
  open,
  onClose,
  workflow,
  onWorkflowDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (!workflow) {
      return;
    }

    setIsDeleting(true);

    // Simulate API call delay
    setTimeout(() => {
      onWorkflowDeleted?.(workflow.id);
      setIsDeleting(false);
      onClose();
    }, 300);
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  if (!workflow) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Workflow</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the workflow &quot;{workflow.name}&quot;? This action cannot be undone.
          {workflow.transitions && workflow.transitions.length > 0 && (
            <strong>
              <br />
              <br />
              Warning: This workflow has {workflow.transitions.length} transition(s) that will also be deleted.
            </strong>
          )}
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

export default DeleteWorkflowDialog;

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
} from '@mui/material';
import { workflowsActions, useSelectorWorkflows } from '../store';
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
  const dispatch = useDispatch();
  const workflowsState = useSelectorWorkflows((state) => state);

  const handleDelete = () => {
    if (!workflow) {
      return;
    }

    dispatch(
      workflowsActions.deleteWorkflowRequest({
        data: { id: workflow.id },
        callback: {
          onSuccess: () => {
            onWorkflowDeleted?.(workflow.id);
            onClose();
          },
          onError: (error: any) => {
            console.error('Failed to delete workflow:', error);
            alert('Failed to delete workflow. Please try again.');
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!workflowsState.deleteWorkflowLoading) {
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
        <Button onClick={handleClose} disabled={workflowsState.deleteWorkflowLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={workflowsState.deleteWorkflowLoading}
          startIcon={workflowsState.deleteWorkflowLoading ? <CircularProgress size={16} /> : null}
        >
          {workflowsState.deleteWorkflowLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteWorkflowDialog;

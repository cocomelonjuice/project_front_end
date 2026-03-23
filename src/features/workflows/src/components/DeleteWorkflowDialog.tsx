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
  const { t, i18n } = useTranslation();
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
            alert(t('workflowDeleteDialog.deleteFailed'));
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
    <Dialog key={i18n.language} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('workflowDeleteDialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('workflowDeleteDialog.confirm', { name: workflow.name })}
          {workflow.transitions && workflow.transitions.length > 0 && (
            <strong>
              <br />
              <br />
              {t('workflowDeleteDialog.transitionsWarning', { count: workflow.transitions.length })}
            </strong>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={workflowsState.deleteWorkflowLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={workflowsState.deleteWorkflowLoading}
          startIcon={workflowsState.deleteWorkflowLoading ? <CircularProgress size={16} /> : null}
        >
          {workflowsState.deleteWorkflowLoading ? t('workflowDeleteDialog.deleting') : t('workflowDeleteDialog.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteWorkflowDialog;

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
} from '@mui/material';
import { projectsActions, useSelectorProjects } from '../store';
import type { Project } from '../store/states';

interface DeleteProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onProjectDeleted?: () => void;
}

const DeleteProjectDialog: React.FC<DeleteProjectDialogProps> = ({
  open,
  onClose,
  project,
  onProjectDeleted,
}) => {
  const dispatch = useDispatch();
  const projectsState = useSelectorProjects((state) => state);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!project) return;

    setError(null);

    // Dispatch Redux action to delete project
    dispatch(
      projectsActions.deleteProjectRequest({
        data: { id: project.id },
        callback: {
          onSuccess: () => {
            if (onProjectDeleted) {
              onProjectDeleted();
            }
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete project';
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!projectsState.deleteProjectLoading) {
      setError(null);
      onClose();
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Project</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DialogContentText>
          Are you sure you want to delete project <strong>{project.name}</strong> ({project.key})?
          <br />
          <br />
          This action cannot be undone. All issues, boards, sprints, and other data associated with
          this project will be permanently deleted.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={projectsState.deleteProjectLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={projectsState.deleteProjectLoading}
          startIcon={projectsState.deleteProjectLoading ? <CircularProgress size={16} /> : null}
        >
          {projectsState.deleteProjectLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProjectDialog;

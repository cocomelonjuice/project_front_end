import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_INPUT_STYLES, UI_BUTTON_STYLES, UI_TRANSITIONS } from '../../../../shared/constants/src/ui';
import { mockUsers } from '../store/mockData';
import { usersActions, useSelectorUsers } from '../../../users/src/store';
import { referenceDataActions, useSelectorReferenceData } from '../../../reference-data/src/store';
import { issuesActions, useSelectorIssues } from '../store';
import { useSelectorAuth } from '../../../auth/src/store';
import type { Issue } from '../store/states';

interface CreateIssueModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  reporterId?: string;
  sprintOptions?: Array<{ id: string; name: string }>;
  defaultSprintId?: string;
  showSprintField?: boolean;
  onIssueCreated?: (issue: Issue) => void;
}

const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  open,
  onClose,
  projectId,
  reporterId,
  sprintOptions = [],
  defaultSprintId,
  showSprintField = false,
  onIssueCreated,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const usersState = useSelectorUsers((state) => state);
  const referenceDataState = useSelectorReferenceData((state) => state);
  const issuesState = useSelectorIssues((state) => state);
  const authState = useSelectorAuth((state) => state);
  const [error, setError] = useState<string | null>(null);
  
  // Get current user ID from auth state, or use provided reporterId, or undefined
  const currentReporterId = authState.user?.id || reporterId || undefined;
  

  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    dueDate: '',
    typeId: '',
    priorityId: '',
    statusId: '',
    assigneeId: '',
    sprintId: '',
  });

  // Fetch users when modal opens
  useEffect(() => {
    if (open && usersState.users.length === 0 && !usersState.getUsersLoading) {
      dispatch(
        usersActions.getUsersRequest({
          data: {},
          callback: {
            onSuccess: () => {
              // Users loaded successfully
            },
            onError: (error: any) => {
              console.error('Failed to load users:', error);
            },
          },
        } as any)
      );
    }
  }, [open, dispatch, usersState.users.length, usersState.getUsersLoading]);

  // Fetch reference data on component mount (only once)
  useEffect(() => {
    // Fetch issue types
    dispatch(
      referenceDataActions.getIssueTypesRequest({
        data: {},
        callback: {
          onSuccess: () => {},
          onError: (error: any) => {
            console.error('Failed to load issue types:', error);
          },
        },
      } as any)
    );

    // Fetch priorities
    dispatch(
      referenceDataActions.getPrioritiesRequest({
        data: {},
        callback: {
          onSuccess: () => {},
          onError: (error: any) => {
            console.error('Failed to load priorities:', error);
          },
        },
      } as any)
    );

    // Fetch statuses
    dispatch(
      referenceDataActions.getStatusesRequest({
        data: {},
        callback: {
          onSuccess: () => {},
          onError: (error: any) => {
            console.error('Failed to load statuses:', error);
          },
        },
      } as any)
    );
  }, [dispatch]);

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setError(null);
      const issueTypes = referenceDataState.issueTypes;
      const priorities = referenceDataState.priorities;
      const statuses = referenceDataState.statuses;
      
      // Find medium priority (orderNum around 3) or default to first
      const mediumPriority = priorities.find((p) => p.orderNum === 3) || priorities[0];
      // Find "To Do" status or default to first
      const todoStatus = statuses.find((s) => s.category === 'todo' || s.name.toLowerCase().includes('todo')) || statuses[0];
      
      setFormData({
        summary: '',
        description: '',
        dueDate: '',
        typeId: issueTypes[0]?.id || '',
        priorityId: mediumPriority?.id || '',
        statusId: todoStatus?.id || '',
        assigneeId: '',
        sprintId: defaultSprintId || '',
      });
    }
  }, [open, referenceDataState.issueTypes, referenceDataState.priorities, referenceDataState.statuses, defaultSprintId]);

  const handleChange = (field: string) => (event: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.summary.trim()) {
      setError(t('issueModal.summaryRequired'));
      return;
    }

    if (formData.summary.trim().length < 3) {
      setError(t('issueModal.summaryMin'));
      return;
    }

    setError(null);

    // Dispatch Redux action to create issue
    dispatch(
      issuesActions.createIssueRequest({
        data: {
          projectId, // Will be extracted in saga and used in URL
          summary: formData.summary.trim(),
          description: formData.description.trim() || undefined,
          dueDate: formData.dueDate || undefined,
          typeId: formData.typeId || undefined,
          priorityId: formData.priorityId || undefined,
          statusId: formData.statusId || undefined,
          assigneeId: formData.assigneeId || undefined,
          sprintId: showSprintField ? formData.sprintId || undefined : undefined,
          reporterId: currentReporterId || undefined,
        },
        callback: {
          onSuccess: (newIssue: Issue) => {
            if (onIssueCreated) {
              onIssueCreated(newIssue);
            }
            onClose();
          },
          onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create issue';
            setError(errorMessage);
          },
        },
      } as any)
    );
  };

  const handleClose = () => {
    if (!issuesState.createIssueLoading) {
      onClose();
    }
  };

  return (
    <Dialog 
      key={i18n.language}
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
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
          pb: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
            color: UI_COLORS.text.primary,
            fontSize: UI_TYPOGRAPHY.fontSize.xl,
          }}
        >
          {t('issueModal.title')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt:3 }}>
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{
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
          <TextField
            label={t('issueModal.summaryLabel')}
            required
            fullWidth
            value={formData.summary}
            onChange={handleChange('summary')}
            disabled={issuesState.createIssueLoading}
            helperText={t('issueModal.summaryHelper')}
            sx={UI_INPUT_STYLES.default}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
              },
            }}
            FormHelperTextProps={{
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.xs,
                color: UI_COLORS.text.secondary,
              },
            }}
          />

          <TextField
            label={t('issueModal.descriptionLabel')}
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange('description')}
            disabled={issuesState.createIssueLoading}
            helperText={t('issueModal.descriptionHelper')}
            sx={UI_INPUT_STYLES.default}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
              },
            }}
            FormHelperTextProps={{
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.xs,
                color: UI_COLORS.text.secondary,
              },
            }}
          />

          <TextField
            label={t('issueModal.dueDate')}
            type="date"
            fullWidth
            value={formData.dueDate}
            onChange={handleChange('dueDate')}
            disabled={issuesState.createIssueLoading}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
              },
            }}
            helperText={t('issueModal.dueDateHelper')}
            FormHelperTextProps={{
              sx: {
                fontSize: UI_TYPOGRAPHY.fontSize.xs,
                color: UI_COLORS.text.secondary,
              },
            }}
            sx={UI_INPUT_STYLES.default}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth disabled={issuesState.createIssueLoading || referenceDataState.getIssueTypesLoading}>
              <InputLabel>{t('issueModal.type')}</InputLabel>
              <Select value={formData.typeId} onChange={handleChange('typeId')} label={t('issueModal.type')}>
                {referenceDataState.issueTypes.length > 0 ? (
                  referenceDataState.issueTypes.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.icon || ''} {type.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>{t('issueModal.loadingTypes')}</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={issuesState.createIssueLoading || referenceDataState.getPrioritiesLoading}>
              <InputLabel>{t('issueModal.priority')}</InputLabel>
              <Select value={formData.priorityId} onChange={handleChange('priorityId')} label={t('issueModal.priority')}>
                {referenceDataState.priorities.length > 0 ? (
                  referenceDataState.priorities.map((priority) => (
                    <MenuItem key={priority.id} value={priority.id}>
                      {priority.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>{t('issueModal.loadingPriorities')}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth disabled={issuesState.createIssueLoading || referenceDataState.getStatusesLoading}>
              <InputLabel>{t('issueModal.status')}</InputLabel>
              <Select value={formData.statusId} onChange={handleChange('statusId')} label={t('issueModal.status')}>
                {referenceDataState.statuses.length > 0 ? (
                  referenceDataState.statuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>{t('issueModal.loadingStatuses')}</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={issuesState.createIssueLoading || usersState.getUsersLoading}>
              <InputLabel>{t('issueModal.assignee')}</InputLabel>
              <Select value={formData.assigneeId} onChange={handleChange('assigneeId')} label={t('issueModal.assignee')}>
                <MenuItem value="">{t('issueModal.unassigned')}</MenuItem>
                {(usersState.users.length > 0 ? usersState.users : mockUsers).map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {showSprintField && (
            <FormControl fullWidth disabled={issuesState.createIssueLoading}>
              <InputLabel>{t('projectDetail.sprints')}</InputLabel>
              <Select value={formData.sprintId} onChange={handleChange('sprintId')} label={t('projectDetail.sprints')}>
                <MenuItem value="">{t('issueModal.unassigned')}</MenuItem>
                {sprintOptions.map((sprint) => (
                  <MenuItem key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={issuesState.createIssueLoading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={issuesState.createIssueLoading || !formData.summary.trim()}
          startIcon={issuesState.createIssueLoading ? <CircularProgress size={16} /> : null}
        >
          {issuesState.createIssueLoading ? t('issueModal.creating') : t('issueModal.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateIssueModal;

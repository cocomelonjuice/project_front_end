import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Button,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { EditIssueModal, DeleteIssueDialog, AssignIssueModal, TransitionStatusModal, issuesActions, useSelectorIssues } from '../../features/issues/src';
import type { Issue } from '../../features/issues/src/store/states';
import {
  CommentList,
  CreateCommentModal,
  EditCommentModal,
  DeleteCommentDialog,
  commentsActions,
  useSelectorComments,
} from '../../features/comments/src';
import type { Comment } from '../../features/comments/src/store/states';
import { useSelectorAuth } from '../../features/auth/src/store';
import {
  AttachmentList,
  UploadAttachmentModal,
  DeleteAttachmentDialog,
  attachmentsActions,
  useSelectorAttachments,
} from '../../features/attachments/src';
import attachmentsApi from '../../features/attachments/src/store/api';
import type { Attachment } from '../../features/attachments/src/store/states';
import {
  LabelsList,
  CreateLabelModal,
  EditLabelModal,
  AssignLabelsModal,
  labelsActions,
  useSelectorLabels,
} from '../../features/labels/src';
import type { Label } from '../../features/labels/src/store/states';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_BUTTON_STYLES } from '../../shared/constants/src/ui';

const IssueDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { projectId, issueId } = useParams<{ projectId: string; issueId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dateLocale = useMemo(
    () => (i18n.language?.startsWith('vi') ? 'vi-VN' : 'en-US'),
    [i18n.language]
  );

  // Redux state
  const authState = useSelectorAuth((state) => state);
  const currentUser = authState.user;
  const commentsState = useSelectorComments((state) => state);
  const comments = commentsState.comments.filter((c) => c.issueId === issueId);
  const issuesState = useSelectorIssues((state) => state);
  const issue = issuesState.currentIssue;
  const attachmentsState = useSelectorAttachments((state) => state);
  const attachments = attachmentsState.attachments.filter((a) => a.issueId === issueId);
  const labelsState = useSelectorLabels((state) => state);
  const allLabels = labelsState.labels;
  // Get issue labels from the issue object (which comes from Redux)
  const issueLabels = issue?.labels || [];

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Comment modals
  const [createCommentModalOpen, setCreateCommentModalOpen] = useState(false);
  const [editCommentModalOpen, setEditCommentModalOpen] = useState(false);
  const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  // Attachment modals
  const [uploadAttachmentModalOpen, setUploadAttachmentModalOpen] = useState(false);
  const [deleteAttachmentDialogOpen, setDeleteAttachmentDialogOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);

  // Label modals
  const [createLabelModalOpen, setCreateLabelModalOpen] = useState(false);
  const [editLabelModalOpen, setEditLabelModalOpen] = useState(false);
  const [assignLabelsModalOpen, setAssignLabelsModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);

  // Assign and Transition modals
  const [assignIssueModalOpen, setAssignIssueModalOpen] = useState(false);
  const [transitionStatusModalOpen, setTransitionStatusModalOpen] = useState(false);

  useEffect(() => {
    if (issueId) {
      // Load all labels from API
      dispatch(
        labelsActions.getLabelsRequest({
          data: {},
          callback: {
            onSuccess: () => {
              // Labels loaded successfully, they're in Redux state
            },
            onError: (error: any) => {
              console.error('Failed to load labels:', error);
            },
          },
        } as any)
      );

      // Load issue from API
      dispatch(
        issuesActions.getIssueByIdRequest({
          data: { id: issueId },
          callback: {
            onSuccess: () => {
              // Issue loaded successfully, it's in Redux state as currentIssue
              // Labels are already in the issue object from the API
            },
            onError: (error: any) => {
              console.error('Failed to load issue:', error);
            },
          },
        } as any)
      );

      // Load comments for this issue from API
      dispatch(
        commentsActions.getCommentsByIssueRequest({
          data: { issueId },
          callback: {
            onSuccess: () => {
              // Comments loaded successfully, they're in Redux state
            },
            onError: (error: any) => {
              console.error('Failed to load comments:', error);
            },
          },
        } as any)
      );

      // Load attachments for this issue from API
      dispatch(
        attachmentsActions.getAttachmentsByIssueRequest({
          data: { issueId },
          callback: {
            onSuccess: () => {
              // Attachments loaded successfully, they're in Redux state
            },
            onError: (error: any) => {
              console.error('Failed to load attachments:', error);
            },
          },
        } as any)
      );
    }
  }, [issueId, dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleBack = () => {
    navigate(`/projects/${projectId}`);
  };

  const handleIssueUpdated = (updatedIssue: Issue) => {
    // Issue is already updated in Redux state by the saga
    // No need to update local state
  };

  const handleIssueDeleted = (deletedIssueId: string) => {
    // Navigate back to project after deletion
    navigate(`/projects/${projectId}`);
  };

  // Comment handlers
  const handleCommentCreated = (newComment: Comment) => {
    // Comment is already added to Redux state by the saga
    // Just refresh the comments list
    if (issueId) {
      dispatch(
        commentsActions.getCommentsByIssueRequest({
          data: { issueId },
          callback: {},
        } as any)
      );
    }
  };

  const handleCommentUpdated = (updatedComment: Comment) => {
    // Comment is already updated in Redux state by the saga
    // No need to do anything
  };

  const handleCommentDeleted = (commentId: string) => {
    // Comment is already removed from Redux state by the saga
    // No need to do anything
  };

  const handleEditComment = (comment: Comment) => {
    setSelectedComment(comment);
    setEditCommentModalOpen(true);
  };

  const handleDeleteComment = (comment: Comment) => {
    setSelectedComment(comment);
    setDeleteCommentDialogOpen(true);
  };

  // Attachment handlers
  const handleAttachmentUploaded = (newAttachment: Attachment) => {
    // Attachment is already added to Redux state by the saga
    // No need to do anything
  };

  const handleAttachmentDeleted = (attachmentId: string) => {
    // Attachment is already removed from Redux state by the saga
    // No need to do anything
  };

  const handleDeleteAttachment = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
    setDeleteAttachmentDialogOpen(true);
  };

  const handleDownloadAttachment = async (attachment: Attachment) => {
    try {
      // Download attachment from API
      const response = await attachmentsApi.downloadAttachment(attachment.id);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.originalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download attachment:', error);
      alert(`Failed to download ${attachment.originalFilename}`);
    }
  };

  // Label handlers
  const handleLabelCreated = (newLabel: Label) => {
    // Label is already added to Redux state by the saga
    // If creating from assign modal, open assign modal again
    if (assignLabelsModalOpen) {
      setAssignLabelsModalOpen(false);
      setTimeout(() => setAssignLabelsModalOpen(true), 100);
    }
  };

  const handleLabelUpdated = (updatedLabel: Label) => {
    // Label is already updated in Redux state by the saga
    setSelectedLabel(null);
  };

  const handleLabelsAssigned = (labelIds: string[]) => {
    // Labels are assigned via API in AssignLabelsModal
    // Refresh the issue to get updated labels
    if (issueId) {
      dispatch(
        issuesActions.getIssueByIdRequest({
          data: { id: issueId },
          callback: {
            onSuccess: () => {
              // Issue refreshed with updated labels
            },
            onError: (error: any) => {
              console.error('Failed to refresh issue:', error);
            },
          },
        } as any)
      );
    }
  };

  const handleEditLabel = (label: Label) => {
    setSelectedLabel(label);
    setEditLabelModalOpen(true);
  };

  // Assign and Transition handlers
  const handleIssueAssigned = (assigneeId: string) => {
    if (!issueId) return;
    
    // Convert empty string to null for unassign (backend expects null to unassign)
    const finalAssigneeId = assigneeId.trim() === '' ? null : assigneeId;
    
    dispatch(
      issuesActions.assignIssueRequest({
        data: {
          id: issueId,
          assigneeId: finalAssigneeId,
        },
        callback: {
          onSuccess: (updatedIssue: Issue) => {
            // Issue is already updated in Redux state by the reducer
            // Refresh to get full assignee data from backend
            if (issueId) {
              dispatch(
                issuesActions.getIssueByIdRequest({
                  data: { id: issueId },
                  callback: {},
                } as any)
              );
            }
            // Close the modal on success
            setAssignIssueModalOpen(false);
          },
          onError: (error: any) => {
            console.error('Failed to assign issue:', error);
            // Don't close modal on error so user can retry
          },
          onFinally: () => {
            // Reset any loading states if needed
          },
        },
      } as any)
    );
  };

  const handleStatusTransitioned = (statusId: string) => {
    // Issue will be updated in Redux state by the transition status action
  };

  // Show loading state while fetching issue
  if (issuesState.getIssueByIdLoading) {
    return (
      <Box sx={{ py: 4, width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress sx={{ color: UI_COLORS.primary.main }} />
        </Box>
      </Box>
    );
  }

  // Show error if issue not found
  if (!issue) {
    return (
      <Box sx={{ py: 4, width: '100%' }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: UI_BORDER_RADIUS.md,
            boxShadow: UI_SHADOWS.sm,
            mb: 2,
          }}
        >
          {t('issueDetailPage.notFound')}
        </Alert>
        <Button
          onClick={handleBack}
          sx={{
            ...UI_BUTTON_STYLES.secondary,
            borderRadius: UI_BORDER_RADIUS.md,
            textTransform: 'none',
            fontSize: UI_TYPOGRAPHY.fontSize.base,
            fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
          }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} />
          {t('issueDetailPage.backToProject')}
        </Button>
      </Box>
    );
  }

  // Data comes from API response, no need for mock fallbacks
  const type = issue.type;
  const priority = issue.priority;
  const status = issue.status;
  const assignee = issue.assignee || null;
  const reporter = issue.reporter || null;

  return (
    <Box sx={{ py: 4, width: '100%' }}>
      {/* Header */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: UI_BORDER_RADIUS.xl,
          boxShadow: UI_SHADOWS.lg,
          background: `linear-gradient(135deg, ${UI_COLORS.background.paper} 0%, ${UI_COLORS.background.subtle} 100%)`,
          border: `1px solid ${UI_COLORS.border.light}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, flex: 1, minWidth: 0 }}>
            <IconButton
              onClick={handleBack}
              size="medium"
              sx={{
                color: UI_COLORS.text.secondary,
                mt: 0.5,
                border: `1px solid ${UI_COLORS.border.light}`,
                '&:hover': {
                  backgroundColor: UI_COLORS.primary.main,
                  color: UI_COLORS.primary.contrast,
                  borderColor: UI_COLORS.primary.main,
                  transform: 'translateY(-2px)',
                  boxShadow: UI_SHADOWS.md,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    wordBreak: 'break-word',
                    fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
                    color: UI_COLORS.text.primary,
                    fontSize: { xs: UI_TYPOGRAPHY.fontSize.xl, md: UI_TYPOGRAPHY.fontSize['2xl'] },
                    lineHeight: 1.2,
                  }}
                >
                  {issue.key}
                </Typography>
                {status && (
                  <Chip
                    label={status.name}
                    size="small"
                    sx={{
                      bgcolor: status.color || UI_COLORS.primary.main,
                      color: 'white',
                      fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                      fontSize: UI_TYPOGRAPHY.fontSize.xs,
                      height: 24,
                      boxShadow: UI_SHADOWS.sm,
                    }}
                  />
                )}
              </Box>
              <Typography
                variant="body1"
                sx={{
                  wordBreak: 'break-word',
                  color: UI_COLORS.text.secondary,
                  fontSize: UI_TYPOGRAPHY.fontSize.lg,
                  lineHeight: 1.6,
                  fontWeight: UI_TYPOGRAPHY.fontWeight.normal,
                }}
              >
                {issue.summary}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                ...UI_BUTTON_STYLES.secondary,
                borderRadius: UI_BORDER_RADIUS.md,
                textTransform: 'none',
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
                fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                px: 2.5,
                py: 1,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: UI_SHADOWS.md,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {t('issueDetailPage.edit')}
            </Button>
            <IconButton
              onClick={handleMenuOpen}
              size="medium"
              sx={{
                color: UI_COLORS.text.secondary,
                border: `1px solid ${UI_COLORS.border.light}`,
                '&:hover': {
                  backgroundColor: UI_COLORS.error.main,
                  color: 'white',
                  borderColor: UI_COLORS.error.main,
                  transform: 'translateY(-2px)',
                  boxShadow: UI_SHADOWS.md,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  borderRadius: UI_BORDER_RADIUS.md,
                  boxShadow: UI_SHADOWS.lg,
                  mt: 1,
                  minWidth: 150,
                  border: `1px solid ${UI_COLORS.border.light}`,
                },
              }}
            >
              <MenuItem
                onClick={handleDelete}
                sx={{
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                  color: UI_COLORS.error.main,
                  '&:hover': {
                    backgroundColor: UI_COLORS.error.bg,
                  },
                }}
              >
                <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
                {t('issueDetailPage.delete')}
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>
        {/* Main Content */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 66.67%', lg: '1 1 80%' }, minWidth: 0 }}>
          <Paper
            sx={{
              p: 4.5,
              mb: 3,
              overflow: 'hidden',
              borderRadius: UI_BORDER_RADIUS.xl,
              boxShadow: UI_SHADOWS.lg,
              backgroundColor: UI_COLORS.background.paper,
              border: `1px solid ${UI_COLORS.border.light}`,
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: UI_SHADOWS.xl,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 3,
                pb: 2,
                borderBottom: `2px solid ${UI_COLORS.border.light}`,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 24,
                  borderRadius: UI_BORDER_RADIUS.full,
                  bgcolor: UI_COLORS.primary.main,
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
                {t('issueDetailPage.description')}
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                color: UI_COLORS.text.primary,
                fontSize: UI_TYPOGRAPHY.fontSize.base,
                lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
                minHeight: 60,
              }}
            >
              {issue.description || (
                <Box
                  component="span"
                  sx={{
                    color: UI_COLORS.text.secondary,
                    fontStyle: 'italic',
                  }}
                >
                  {t('issueDetailPage.noDescription')}
                </Box>
              )}
            </Typography>
          </Paper>

          {/* Labels Section */}
          <Paper
            sx={{
              p: 4.5,
              mb: 3,
              overflow: 'hidden',
              borderRadius: UI_BORDER_RADIUS.xl,
              boxShadow: UI_SHADOWS.lg,
              backgroundColor: UI_COLORS.background.paper,
              border: `1px solid ${UI_COLORS.border.light}`,
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: UI_SHADOWS.xl,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                pb: 2,
                borderBottom: `2px solid ${UI_COLORS.border.light}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    borderRadius: UI_BORDER_RADIUS.full,
                    bgcolor: UI_COLORS.secondary.main,
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
                  {t('issueDetailPage.labelsHeading', { count: issueLabels.length })}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                onClick={() => setAssignLabelsModalOpen(true)}
                sx={{
                  ...UI_BUTTON_STYLES.primary,
                  borderRadius: UI_BORDER_RADIUS.md,
                  textTransform: 'none',
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                  fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                  px: 2.5,
                  py: 1,
                  boxShadow: UI_SHADOWS.md,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: UI_SHADOWS.lg,
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {issueLabels.length > 0 ? t('issueDetailPage.editLabels') : t('issueDetailPage.addLabels')}
              </Button>
            </Box>
            <LabelsList
              labels={issueLabels}
              emptyMessage={t('issueDetailPage.labelsEmpty')}
            />
          </Paper>

          {/* Attachments Section */}
          <Paper
            sx={{
              p: 4.5,
              mb: 3,
              overflow: 'hidden',
              borderRadius: UI_BORDER_RADIUS.xl,
              boxShadow: UI_SHADOWS.lg,
              backgroundColor: UI_COLORS.background.paper,
              border: `1px solid ${UI_COLORS.border.light}`,
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: UI_SHADOWS.xl,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                pb: 2,
                borderBottom: `2px solid ${UI_COLORS.border.light}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    borderRadius: UI_BORDER_RADIUS.full,
                    bgcolor: UI_COLORS.info.main,
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
                  {t('issueDetailPage.attachmentsHeading', { count: attachments.length })}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                onClick={() => setUploadAttachmentModalOpen(true)}
                sx={{
                  ...UI_BUTTON_STYLES.primary,
                  borderRadius: UI_BORDER_RADIUS.md,
                  textTransform: 'none',
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                  fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                  px: 2.5,
                  py: 1,
                  boxShadow: UI_SHADOWS.md,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: UI_SHADOWS.lg,
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {t('issueDetailPage.uploadFile')}
              </Button>
            </Box>
            <AttachmentList
              attachments={attachments}
              onDelete={handleDeleteAttachment}
              onDownload={handleDownloadAttachment}
              currentUserId={currentUser?.id || ''}
            />
          </Paper>

          {/* Comments Section */}
          <Paper
            sx={{
              p: 4.5,
              overflow: 'hidden',
              borderRadius: UI_BORDER_RADIUS.xl,
              boxShadow: UI_SHADOWS.lg,
              backgroundColor: UI_COLORS.background.paper,
              border: `1px solid ${UI_COLORS.border.light}`,
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: UI_SHADOWS.xl,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                pb: 2,
                borderBottom: `2px solid ${UI_COLORS.border.light}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    borderRadius: UI_BORDER_RADIUS.full,
                    bgcolor: UI_COLORS.success.main,
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
                  {t('issueDetailPage.commentsHeading', { count: comments.length })}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                onClick={() => setCreateCommentModalOpen(true)}
                sx={{
                  ...UI_BUTTON_STYLES.primary,
                  borderRadius: UI_BORDER_RADIUS.md,
                  textTransform: 'none',
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                  fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                  px: 2.5,
                  py: 1,
                  boxShadow: UI_SHADOWS.md,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: UI_SHADOWS.lg,
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {t('issueDetailPage.addComment')}
              </Button>
            </Box>
            <CommentList
              comments={comments}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              currentUserId={currentUser?.id}
            />
          </Paper>
        </Box>

        {/* Sidebar */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.33%', lg: '1 1 20%' }, minWidth: 0 }}>
          <Card
            sx={{
              mb: 3,
              overflow: 'hidden',
              borderRadius: UI_BORDER_RADIUS.xl,
              boxShadow: UI_SHADOWS.lg,
              backgroundColor: UI_COLORS.background.paper,
              border: `1px solid ${UI_COLORS.border.light}`,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: UI_SHADOWS.xl,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  pb: 1.5,
                  borderBottom: `1px solid ${UI_COLORS.border.light}`,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: UI_COLORS.text.secondary,
                    fontSize: UI_TYPOGRAPHY.fontSize.xs,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('issueDetailPage.fieldType')}
                </Typography>
              </Box>
              <Chip
                label={type?.name || t('issueDetailPage.unknown')}
                size="medium"
                sx={{
                  bgcolor: type?.color || UI_COLORS.text.secondary,
                  color: 'white',
                  mb: 3,
                  fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                  height: 32,
                  boxShadow: UI_SHADOWS.sm,
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  pb: 1.5,
                  borderBottom: `1px solid ${UI_COLORS.border.light}`,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: UI_COLORS.text.secondary,
                    fontSize: UI_TYPOGRAPHY.fontSize.xs,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('issueDetailPage.fieldPriority')}
                </Typography>
              </Box>
              <Chip
                label={priority?.name || t('issueDetailPage.unknown')}
                size="medium"
                sx={{
                  bgcolor: priority?.color || UI_COLORS.text.secondary,
                  color: 'white',
                  mb: 3,
                  fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                  height: 32,
                  boxShadow: UI_SHADOWS.sm,
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                  pb: 1.5,
                  borderBottom: `1px solid ${UI_COLORS.border.light}`,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: UI_COLORS.text.secondary,
                    fontSize: UI_TYPOGRAPHY.fontSize.xs,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('issueDetailPage.fieldStatus')}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setTransitionStatusModalOpen(true)}
                  sx={{
                    ...UI_BUTTON_STYLES.secondary,
                    borderRadius: UI_BORDER_RADIUS.md,
                    textTransform: 'none',
                    fontSize: UI_TYPOGRAPHY.fontSize.xs,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                    px: 1.5,
                    py: 0.5,
                    borderWidth: 1.5,
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: UI_SHADOWS.sm,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {t('issueDetailPage.change')}
                </Button>
              </Box>
              <Chip
                label={status?.name || t('issueDetailPage.unknown')}
                size="medium"
                sx={{
                  bgcolor: status?.color || UI_COLORS.text.secondary,
                  color: 'white',
                  mb: 3,
                  fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                  height: 32,
                  boxShadow: UI_SHADOWS.sm,
                }}
              />
            </CardContent>
          </Card>

          <Card
            sx={{
              mb: 3,
              overflow: 'hidden',
              borderRadius: UI_BORDER_RADIUS.xl,
              boxShadow: UI_SHADOWS.lg,
              backgroundColor: UI_COLORS.background.paper,
              border: `1px solid ${UI_COLORS.border.light}`,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: UI_SHADOWS.xl,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  pb: 1.5,
                  borderBottom: `1px solid ${UI_COLORS.border.light}`,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: UI_COLORS.text.secondary,
                    fontSize: UI_TYPOGRAPHY.fontSize.xs,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('issueDetailPage.fieldAssignee')}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setAssignIssueModalOpen(true)}
                  sx={{
                    ...UI_BUTTON_STYLES.secondary,
                    borderRadius: UI_BORDER_RADIUS.md,
                    textTransform: 'none',
                    fontSize: UI_TYPOGRAPHY.fontSize.xs,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                    px: 1.5,
                    py: 0.5,
                    borderWidth: 1.5,
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: UI_SHADOWS.sm,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {assignee ? t('issueDetailPage.change') : t('issueDetailPage.assign')}
                </Button>
              </Box>
              {assignee ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: UI_BORDER_RADIUS.md,
                    backgroundColor: UI_COLORS.background.subtle,
                    border: `1px solid ${UI_COLORS.border.light}`,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: UI_COLORS.primary.main,
                      fontSize: UI_TYPOGRAPHY.fontSize.base,
                      fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
                      boxShadow: UI_SHADOWS.sm,
                    }}
                  >
                    {assignee.displayName.charAt(0)}
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{
                      wordBreak: 'break-word',
                      color: UI_COLORS.text.primary,
                      fontSize: UI_TYPOGRAPHY.fontSize.base,
                      fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                    }}
                  >
                    {assignee.displayName}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: UI_BORDER_RADIUS.md,
                    backgroundColor: UI_COLORS.background.subtle,
                    border: `1px dashed ${UI_COLORS.border.medium}`,
                  }}
                >
                  <PersonIcon sx={{ fontSize: 24, color: UI_COLORS.text.disabled }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: UI_COLORS.text.secondary,
                      fontSize: UI_TYPOGRAPHY.fontSize.base,
                      fontStyle: 'italic',
                    }}
                  >
                    {t('issueDetailPage.unassigned')}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card
            sx={{
              mb: 3,
              overflow: 'hidden',
              borderRadius: UI_BORDER_RADIUS.xl,
              boxShadow: UI_SHADOWS.lg,
              backgroundColor: UI_COLORS.background.paper,
              border: `1px solid ${UI_COLORS.border.light}`,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: UI_SHADOWS.xl,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  pb: 1.5,
                  borderBottom: `1px solid ${UI_COLORS.border.light}`,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: UI_COLORS.text.secondary,
                    fontSize: UI_TYPOGRAPHY.fontSize.xs,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('issueDetailPage.fieldReporter')}
                </Typography>
              </Box>
              {reporter ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    borderRadius: UI_BORDER_RADIUS.md,
                    backgroundColor: UI_COLORS.background.subtle,
                    border: `1px solid ${UI_COLORS.border.light}`,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: UI_COLORS.secondary.main,
                      fontSize: UI_TYPOGRAPHY.fontSize.base,
                      fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
                      boxShadow: UI_SHADOWS.sm,
                    }}
                  >
                    {reporter.displayName.charAt(0)}
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{
                      wordBreak: 'break-word',
                      color: UI_COLORS.text.primary,
                      fontSize: UI_TYPOGRAPHY.fontSize.base,
                      fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                    }}
                  >
                    {reporter.displayName}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: UI_BORDER_RADIUS.md,
                    backgroundColor: UI_COLORS.background.subtle,
                    border: `1px dashed ${UI_COLORS.border.medium}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: UI_COLORS.text.secondary,
                      fontSize: UI_TYPOGRAPHY.fontSize.base,
                      fontStyle: 'italic',
                    }}
                  >
                    {t('issueDetailPage.unknown')}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card
            sx={{
              overflow: 'hidden',
              borderRadius: UI_BORDER_RADIUS.xl,
              boxShadow: UI_SHADOWS.lg,
              backgroundColor: UI_COLORS.background.paper,
              border: `1px solid ${UI_COLORS.border.light}`,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: UI_SHADOWS.xl,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  pb: 1.5,
                  borderBottom: `1px solid ${UI_COLORS.border.light}`,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: UI_COLORS.text.secondary,
                    fontSize: UI_TYPOGRAPHY.fontSize.xs,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {t('issueDetailPage.timeline')}
                </Typography>
              </Box>
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: UI_COLORS.text.secondary,
                    fontSize: UI_TYPOGRAPHY.fontSize.xs,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                    mb: 1,
                  }}
                >
                  {t('issueDetailPage.created')}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: UI_COLORS.text.primary,
                    fontSize: UI_TYPOGRAPHY.fontSize.base,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                  }}
                >
                  {new Date(issue.createdAt).toLocaleDateString(dateLocale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: UI_COLORS.text.secondary,
                    fontSize: UI_TYPOGRAPHY.fontSize.xs,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                    mb: 1,
                  }}
                >
                  {t('issueDetailPage.updated')}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: UI_COLORS.text.primary,
                    fontSize: UI_TYPOGRAPHY.fontSize.base,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                  }}
                >
                  {new Date(issue.updatedAt).toLocaleDateString(dateLocale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Modals */}
      {issue && (
        <>
          <EditIssueModal
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            issue={issue}
            onIssueUpdated={handleIssueUpdated}
          />
          <DeleteIssueDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            issue={issue}
            onIssueDeleted={handleIssueDeleted}
          />
        </>
      )}

      {/* Comment Modals */}
      <CreateCommentModal
        open={createCommentModalOpen}
        onClose={() => setCreateCommentModalOpen(false)}
        issueId={issueId || ''}
        authorId={currentUser?.id}
        onCommentCreated={handleCommentCreated}
      />
      {selectedComment && (
        <>
          <EditCommentModal
            open={editCommentModalOpen}
            onClose={() => {
              setEditCommentModalOpen(false);
              setSelectedComment(null);
            }}
            comment={selectedComment}
            onCommentUpdated={handleCommentUpdated}
          />
          <DeleteCommentDialog
            open={deleteCommentDialogOpen}
            onClose={() => {
              setDeleteCommentDialogOpen(false);
              setSelectedComment(null);
            }}
            comment={selectedComment}
            onCommentDeleted={handleCommentDeleted}
          />
        </>
      )}

      {/* Attachment Modals */}
      <UploadAttachmentModal
        open={uploadAttachmentModalOpen}
        onClose={() => setUploadAttachmentModalOpen(false)}
        issueId={issueId || ''}
        uploadedById={currentUser?.id}
        onAttachmentUploaded={handleAttachmentUploaded}
      />
      {selectedAttachment && (
        <DeleteAttachmentDialog
          open={deleteAttachmentDialogOpen}
          onClose={() => {
            setDeleteAttachmentDialogOpen(false);
            setSelectedAttachment(null);
          }}
          attachment={selectedAttachment}
          onAttachmentDeleted={handleAttachmentDeleted}
        />
      )}

      {/* Label Modals */}
      <CreateLabelModal
        open={createLabelModalOpen}
        onClose={() => setCreateLabelModalOpen(false)}
        onLabelCreated={handleLabelCreated}
        existingLabels={allLabels}
      />
      {selectedLabel && (
        <EditLabelModal
          open={editLabelModalOpen}
          onClose={() => {
            setEditLabelModalOpen(false);
            setSelectedLabel(null);
          }}
          label={selectedLabel}
          onLabelUpdated={handleLabelUpdated}
          existingLabels={allLabels}
        />
      )}
      <AssignLabelsModal
        open={assignLabelsModalOpen}
        onClose={() => setAssignLabelsModalOpen(false)}
        issueId={issueId || ''}
        availableLabels={allLabels}
        assignedLabelIds={issue?.labelIds || []}
        onLabelsAssigned={handleLabelsAssigned}
        onCreateLabel={() => {
          setAssignLabelsModalOpen(false);
          setCreateLabelModalOpen(true);
        }}
      />

      {/* Assign and Transition Modals */}
      <AssignIssueModal
        open={assignIssueModalOpen}
        onClose={() => setAssignIssueModalOpen(false)}
        issueId={issueId || ''}
        currentAssigneeId={issue?.assigneeId}
        onIssueAssigned={handleIssueAssigned}
      />
      <TransitionStatusModal
        open={transitionStatusModalOpen}
        onClose={() => setTransitionStatusModalOpen(false)}
        issueId={issueId || ''}
        currentStatusId={issue?.statusId || ''}
        onStatusTransitioned={handleStatusTransitioned}
      />
    </Box>
  );
};

export default IssueDetail;

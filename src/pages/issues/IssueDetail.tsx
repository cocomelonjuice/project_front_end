import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Button,
  Divider,
  Grid,
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

const IssueDetail: React.FC = () => {
  const { projectId, issueId } = useParams<{ projectId: string; issueId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error if issue not found
  if (!issue) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Issue not found</Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          <ArrowBackIcon sx={{ mr: 1 }} />
          Back to Project
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
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
          <IconButton onClick={handleBack} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="h4" component="h1" sx={{ wordBreak: 'break-word' }}>
              {issue.key}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
              {issue.summary}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handleMenuOpen} size="small">
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
            <MenuItem onClick={handleEdit}>
              <EditIcon sx={{ mr: 1, fontSize: 18 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
              Delete
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8} sx={{ minWidth: 0 }}>
          <Paper sx={{ p: 3, mb: 3, overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {issue.description || 'No description provided.'}
            </Typography>
          </Paper>

          {/* Labels Section */}
          <Paper sx={{ p: 3, mb: 3, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Labels ({issueLabels.length})
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => setAssignLabelsModalOpen(true)}
              >
                {issueLabels.length > 0 ? 'Edit Labels' : 'Add Labels'}
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <LabelsList
              labels={issueLabels}
              emptyMessage="No labels assigned"
            />
          </Paper>

          {/* Attachments Section */}
          <Paper sx={{ p: 3, mb: 3, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Attachments ({attachments.length})
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => setUploadAttachmentModalOpen(true)}
              >
                Upload File
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <AttachmentList
              attachments={attachments}
              onDelete={handleDeleteAttachment}
              onDownload={handleDownloadAttachment}
              currentUserId={currentUser?.id || ''}
            />
          </Paper>

          {/* Comments Section */}
          <Paper sx={{ p: 3, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Comments ({comments.length})
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => setCreateCommentModalOpen(true)}
              >
                Add Comment
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <CommentList
              comments={comments}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              currentUserId={currentUser?.id}
            />
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4} sx={{ minWidth: 0 }}>
          <Card sx={{ mb: 2, overflow: 'hidden' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Type
              </Typography>
              <Chip
                label={type?.name || 'Unknown'}
                size="small"
                sx={{
                  bgcolor: type?.color || '#ccc',
                  color: 'white',
                  mb: 2,
                }}
              />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                Priority
              </Typography>
              <Chip
                label={priority?.name || 'Unknown'}
                size="small"
                sx={{
                  bgcolor: priority?.color || '#ccc',
                  color: 'white',
                  mb: 2,
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2, mb: 0 }}>
                  Status
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setTransitionStatusModalOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Change
                </Button>
              </Box>
              <Chip
                label={status?.name || 'Unknown'}
                size="small"
                sx={{
                  bgcolor: status?.color || '#ccc',
                  color: 'white',
                  mb: 2,
                }}
              />
            </CardContent>
          </Card>

          <Card sx={{ mb: 2, overflow: 'hidden' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Assignee
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setAssignIssueModalOpen(true)}
                >
                  {assignee ? 'Change' : 'Assign'}
                </Button>
              </Box>
              {assignee ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {assignee.displayName.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {assignee.displayName}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <PersonIcon fontSize="small" color="disabled" />
                  <Typography variant="body2" color="text.secondary">
                    Unassigned
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={{ overflow: 'hidden' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Reporter
              </Typography>
              {reporter ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {reporter.displayName.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {reporter.displayName}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Unknown
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 2, overflow: 'hidden' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Created
              </Typography>
              <Typography variant="body2">
                {new Date(issue.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                Updated
              </Typography>
              <Typography variant="body2">
                {new Date(issue.updatedAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

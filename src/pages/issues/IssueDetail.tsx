import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { EditIssueModal, DeleteIssueDialog, AssignIssueModal, TransitionStatusModal } from '../../features/issues/src';
import { mockIssueTypes, mockPriorities, mockStatuses, mockUsers, mockIssues } from '../../features/issues/src/store/mockData';
import type { Issue } from '../../features/issues/src/store/states';
import {
  CommentList,
  CreateCommentModal,
  EditCommentModal,
  DeleteCommentDialog,
} from '../../features/comments/src';
import { mockComments } from '../../features/comments/src/store/mockData';
import type { Comment } from '../../features/comments/src/store/states';
import {
  AttachmentList,
  UploadAttachmentModal,
  DeleteAttachmentDialog,
} from '../../features/attachments/src';
import { mockAttachments } from '../../features/attachments/src/store/mockData';
import type { Attachment } from '../../features/attachments/src/store/states';
import {
  LabelsList,
  CreateLabelModal,
  EditLabelModal,
  AssignLabelsModal,
} from '../../features/labels/src';
import { mockLabels } from '../../features/labels/src/store/mockData';
import type { Label } from '../../features/labels/src/store/states';

const IssueDetail: React.FC = () => {
  const { projectId, issueId } = useParams<{ projectId: string; issueId: string }>();
  const navigate = useNavigate();

  // Load issue from mock data
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [allLabels, setAllLabels] = useState<Label[]>(mockLabels);
  const [issueLabels, setIssueLabels] = useState<Label[]>([]);

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
      // Find issue in mock data
      const foundIssue = mockIssues.find((i) => i.id === issueId);
      if (foundIssue) {
        setIssue(foundIssue);
      }

      // Load comments for this issue
      const issueComments = mockComments.filter((c) => c.issueId === issueId);
      setComments(issueComments);

      // Load attachments for this issue
      const issueAttachments = mockAttachments.filter((a) => a.issueId === issueId);
      setAttachments(issueAttachments);

      // Load labels for this issue
      if (foundIssue && foundIssue.labelIds) {
        const labels = mockLabels.filter((l) => foundIssue.labelIds?.includes(l.id));
        setIssueLabels(labels);
      } else {
        setIssueLabels([]);
      }
    }
  }, [issueId]);

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
    // Update issue in local state
    setIssue(updatedIssue);
  };

  const handleIssueDeleted = (deletedIssueId: string) => {
    // Navigate back to project after deletion
    navigate(`/projects/${projectId}`);
  };

  // Comment handlers
  const handleCommentCreated = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleCommentUpdated = (updatedComment: Comment) => {
    setComments((prev) =>
      prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
    );
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
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
    setAttachments((prev) => [newAttachment, ...prev]);
  };

  const handleAttachmentDeleted = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  };

  const handleDeleteAttachment = (attachment: Attachment) => {
    setSelectedAttachment(attachment);
    setDeleteAttachmentDialogOpen(true);
  };

  const handleDownloadAttachment = (attachment: Attachment) => {
    // In real implementation, this would download from the API
    // For mock, we'll just log it
    console.log('Downloading attachment:', attachment.originalFilename);
    // Simulate download
    const link = document.createElement('a');
    link.href = '#'; // In real app, this would be the download URL
    link.download = attachment.originalFilename;
    // For now, just show an alert
    alert(`Downloading ${attachment.originalFilename} (mock)`);
  };

  // Label handlers
  const handleLabelCreated = (newLabel: Label) => {
    setAllLabels((prev) => [...prev, newLabel]);
    // If creating from assign modal, open assign modal again
    if (assignLabelsModalOpen) {
      setAssignLabelsModalOpen(false);
      setTimeout(() => setAssignLabelsModalOpen(true), 100);
    }
  };

  const handleLabelUpdated = (updatedLabel: Label) => {
    setAllLabels((prev) => prev.map((l) => (l.id === updatedLabel.id ? updatedLabel : l)));
    setIssueLabels((prev) =>
      prev.map((l) => (l.id === updatedLabel.id ? updatedLabel : l))
    );
    setSelectedLabel(null);
  };

  const handleLabelsAssigned = (labelIds: string[]) => {
    const labels = allLabels.filter((l) => labelIds.includes(l.id));
    setIssueLabels(labels);
    // Update issue in local state
    if (issue) {
      setIssue({ ...issue, labelIds, labels });
    }
  };

  const handleEditLabel = (label: Label) => {
    setSelectedLabel(label);
    setEditLabelModalOpen(true);
  };

  // Assign and Transition handlers
  const handleIssueAssigned = (assigneeId: string) => {
    if (issue) {
      const newAssignee = assigneeId ? mockUsers.find((u) => u.id === assigneeId) : undefined;
      setIssue({
        ...issue,
        assigneeId: assigneeId || undefined,
        assignee: newAssignee,
      });
    }
  };

  const handleStatusTransitioned = (statusId: string) => {
    if (issue) {
      const newStatus = mockStatuses.find((s) => s.id === statusId);
      setIssue({
        ...issue,
        statusId: statusId,
        status: newStatus,
      });
    }
  };

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

  const type = issue.type || mockIssueTypes.find((t) => t.id === issue.typeId);
  const priority = issue.priority || mockPriorities.find((p) => p.id === issue.priorityId);
  const status = issue.status || mockStatuses.find((s) => s.id === issue.statusId);
  const assignee = issue.assignee || (issue.assigneeId ? mockUsers.find((u) => u.id === issue.assigneeId) : null);
  const reporter = issue.reporter || mockUsers.find((u) => u.id === issue.reporterId);

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
              currentUserId="1" // Mock current user ID
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
              currentUserId="1" // Mock current user ID
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
        authorId="1"
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
        uploadedById="1"
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
        availableUsers={mockUsers}
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

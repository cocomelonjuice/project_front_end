import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { Comment } from '../store/states';

interface CommentListProps {
  comments: Comment[];
  onEdit?: (comment: Comment) => void;
  onDelete?: (comment: Comment) => void;
  currentUserId?: string; // To show edit/delete only for own comments
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onEdit,
  onDelete,
  currentUserId,
}) => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language?.startsWith('vi') ? 'vi-VN' : 'en-US';

  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [selectedComment, setSelectedComment] = React.useState<Comment | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, comment: Comment) => {
    setMenuAnchor(event.currentTarget);
    setSelectedComment(comment);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedComment(null);
  };

  const handleEdit = () => {
    if (selectedComment && onEdit) {
      onEdit(selectedComment);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedComment && onDelete) {
      onDelete(selectedComment);
    }
    handleMenuClose();
  };

  if (comments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        {t('commentList.empty')}
      </Typography>
    );
  }

  return (
    <Box>
      {comments.map((comment, index) => {
        const author = comment.author;
        const isOwnComment = currentUserId === comment.authorId;
        const canEdit = isOwnComment && onEdit;
        const canDelete = isOwnComment && onDelete;

        return (
          <Box key={comment.id}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* Avatar */}
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                }}
              >
                {author?.displayName.charAt(0) || 'U'}
              </Avatar>

              {/* Comment Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {author?.displayName || t('commentList.unknownUser')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleDateString(dateLocale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                    {comment.updatedAt !== comment.createdAt && (
                      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        {t('commentList.edited')}
                      </Typography>
                    )}
                  </Box>
                  {(canEdit || canDelete) && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, comment)}
                      sx={{ ml: 1 }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  {comment.content}
                </Typography>
              </Box>
            </Box>

            {index < comments.length - 1 && <Divider sx={{ mb: 2 }} />}
          </Box>
        );
      })}

      {/* Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        {onEdit && (
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1, fontSize: 18 }} />
            {t('home.edit')}
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
            {t('home.delete')}
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default CommentList;

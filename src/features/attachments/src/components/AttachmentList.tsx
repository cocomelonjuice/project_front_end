import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  FolderZip as ZipIcon,
  TableChart as ExcelIcon,
} from '@mui/icons-material';
import type { Attachment } from '../store/states';
import { formatFileSize, getFileIcon } from '../store/mockData';

interface AttachmentListProps {
  attachments: Attachment[];
  onDelete?: (attachment: Attachment) => void;
  onDownload?: (attachment: Attachment) => void;
  currentUserId?: string; // For permission checks
}

const AttachmentList: React.FC<AttachmentListProps> = ({
  attachments,
  onDelete,
  onDownload,
  currentUserId,
}) => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language?.startsWith('vi') ? 'vi-VN' : 'en-US';

  const getFileIconComponent = (mimeType: string) => {
    const iconName = getFileIcon(mimeType);
    switch (iconName) {
      case 'image':
        return <ImageIcon />;
      case 'picture_as_pdf':
        return <PdfIcon />;
      case 'description':
        return <DocIcon />;
      case 'video_file':
        return <VideoIcon />;
      case 'audio_file':
        return <AudioIcon />;
      case 'folder_zip':
        return <ZipIcon />;
      case 'table_chart':
        return <ExcelIcon />;
      default:
        return <FileIcon />;
    }
  };

  if (attachments.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          {t('issueDetailPage.attachmentsEmpty')}
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {attachments.map((attachment) => {
        const canDelete = currentUserId && (
          attachment.uploadedById === currentUserId || true // For now, allow all
        );

        return (
          <ListItem
            key={attachment.id}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              mb: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.light',
                mr: 2,
                width: 40,
                height: 40,
              }}
            >
              {getFileIconComponent(attachment.mimeType)}
            </Avatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
                    {attachment.originalFilename}
                  </Typography>
                  <Chip
                    label={formatFileSize(attachment.size)}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                </Box>
              }
              secondary={
                <Typography variant="caption" color="text.secondary">
                  {attachment.uploadedBy?.displayName || t('issueDetailPage.unknown')} •{' '}
                  {new Date(attachment.createdAt).toLocaleDateString(dateLocale)}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {onDownload && (
                  <Tooltip title={t('issueDetailPage.attachmentDownload')}>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onDownload(attachment)}
                      color="primary"
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {onDelete && canDelete && (
                  <Tooltip title={t('issueDetailPage.attachmentDelete')}>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onDelete(attachment)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
};

export default AttachmentList;

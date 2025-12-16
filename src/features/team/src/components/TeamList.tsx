import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
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
import type { ProjectTeamMember } from '../store/states';

interface TeamListProps {
  teamMembers: ProjectTeamMember[];
  onEdit?: (member: ProjectTeamMember) => void;
  onRemove?: (member: ProjectTeamMember) => void;
  emptyMessage?: string;
}

const TeamList: React.FC<TeamListProps> = ({
  teamMembers,
  onEdit,
  onRemove,
  emptyMessage = 'No team members',
}) => {
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [selectedMember, setSelectedMember] = React.useState<ProjectTeamMember | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, member: ProjectTeamMember) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedMember(null);
  };

  if (teamMembers.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {teamMembers.map((member) => (
        <Card key={member.userId} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: 'primary.main',
                  }}
                >
                  {member.user.displayName.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
                    {member.user.displayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                    {member.user.email}
                  </Typography>
                </Box>
                <Chip
                  label={member.role.name}
                  size="small"
                  sx={{
                    bgcolor: 'primary.light',
                    color: 'white',
                  }}
                />
              </Box>
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, member)}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            {member.role.description && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {member.role.description}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        {selectedMember && onEdit && (
          <MenuItem onClick={() => {
            onEdit(selectedMember);
            handleMenuClose();
          }}>
            <EditIcon sx={{ mr: 1, fontSize: 18 }} />
            Change Role
          </MenuItem>
        )}
        {selectedMember && onRemove && (
          <>
            <Divider />
            <MenuItem
              onClick={() => {
                onRemove(selectedMember);
                handleMenuClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
              Remove from Team
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default TeamList;

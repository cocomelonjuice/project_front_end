import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  Box,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Folder as ProjectIcon,
  BugReport as IssueIcon,
  Person as UserIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchActions, useSelectorSearch } from '../store';
import type { SearchProject, SearchIssue, SearchUser } from '../store/states';

export interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchState = useSelectorSearch((state) => state);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleClose = (event?: any, reason?: string) => {
    onClose();
  };

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
      dispatch(searchActions.clearSearch());
    }
  }, [open, dispatch]);

  // Search when query changes - debounced
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length > 0) {
        dispatch(
          searchActions.searchRequest({
            query,
            type: 'all',
            limit: 5,
          }),
        );
      } else {
        dispatch(searchActions.clearSearch());
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, dispatch]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const total = getTotalResults();
          return prev < total - 1 ? prev + 1 : prev;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        handleResultClick(getResultByIndex(selectedIndex));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, searchState.results]);

  const getTotalResults = () => {
    if (!searchState.results) return 0;
    return (
      searchState.results.projects.length +
      searchState.results.issues.length +
      searchState.results.users.length
    );
  };

  const getResultByIndex = (index: number): { type: string; data: any } | null => {
    if (!searchState.results) return null;

    let currentIndex = 0;
    const { projects, issues, users } = searchState.results;

    if (index < projects.length) {
      return { type: 'project', data: projects[index] };
    }
    currentIndex += projects.length;

    if (index < currentIndex + issues.length) {
      return { type: 'issue', data: issues[index - currentIndex] };
    }
    currentIndex += issues.length;

    if (index < currentIndex + users.length) {
      return { type: 'user', data: users[index - currentIndex] };
    }

    return null;
  };

  const handleResultClick = (result: { type: string; data: any } | null) => {
    if (!result) return;

    switch (result.type) {
      case 'project':
        navigate(`/projects/${result.data.id}`);
        break;
      case 'issue':
        // Fix: Use correct route with projectId
        if (result.data.project?.id) {
          navigate(`/projects/${result.data.project.id}/issues/${result.data.id}`);
        } else {
          console.error('Issue has no project ID, cannot navigate');
        }
        break;
      case 'user':
        navigate(`/users/${result.data.id}`);
        break;
    }
    onClose();
  };

  const renderProject = (project: SearchProject, index: number) => (
    <ListItem key={project.id} disablePadding>
      <ListItemButton
        selected={selectedIndex === index}
        onClick={() => handleResultClick({ type: 'project', data: project })}
        sx={{
          py: 1.5,
          px: 2,
          '&:hover': {
            backgroundColor: '#f3f4f6',
          },
          '&.Mui-selected': {
            backgroundColor: '#e0e7ff',
            '&:hover': {
              backgroundColor: '#c7d2fe',
            },
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <ProjectIcon sx={{ color: '#6366f1' }} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" fontWeight={600}>
                {project.name}
              </Typography>
              <Chip label={project.key} size="small" sx={{ height: 20, fontSize: '11px' }} />
            </Box>
          }
          secondary={
            <Typography variant="caption" color="text.secondary">
              {project.type} {project.description && `• ${project.description}`}
            </Typography>
          }
        />
        <ArrowIcon sx={{ color: '#9ca3af', fontSize: '18px' }} />
      </ListItemButton>
    </ListItem>
  );

  const renderIssue = (issue: SearchIssue, index: number, projectStartIndex: number) => (
    <ListItem key={issue.id} disablePadding>
      <ListItemButton
        selected={selectedIndex === index}
        onClick={() => handleResultClick({ type: 'issue', data: issue })}
        sx={{
          py: 1.5,
          px: 2,
          '&:hover': {
            backgroundColor: '#f3f4f6',
          },
          '&.Mui-selected': {
            backgroundColor: '#e0e7ff',
            '&:hover': {
              backgroundColor: '#c7d2fe',
            },
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <IssueIcon sx={{ color: '#ef4444' }} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body1" fontWeight={600}>
                {issue.key}: {issue.summary}
              </Typography>
              {issue.status && (
                <Chip
                  label={issue.status.name}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '11px',
                    backgroundColor: issue.status.color || '#e5e7eb',
                  }}
                />
              )}
            </Box>
          }
          secondary={
            <Typography variant="caption" color="text.secondary">
              {issue.project?.name || t('searchModal.unknownProject')}
              {issue.assignee &&
                ` • ${t('searchModal.assignedTo', { name: issue.assignee.displayName })}`}
            </Typography>
          }
        />
        <ArrowIcon sx={{ color: '#9ca3af', fontSize: '18px' }} />
      </ListItemButton>
    </ListItem>
  );

  const renderUser = (user: SearchUser, index: number, issueStartIndex: number) => (
    <ListItem key={user.id} disablePadding>
      <ListItemButton
        selected={selectedIndex === index}
        onClick={() => handleResultClick({ type: 'user', data: user })}
        sx={{
          py: 1.5,
          px: 2,
          '&:hover': {
            backgroundColor: '#f3f4f6',
          },
          '&.Mui-selected': {
            backgroundColor: '#e0e7ff',
            '&:hover': {
              backgroundColor: '#c7d2fe',
            },
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <UserIcon sx={{ color: '#10b981' }} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body1" fontWeight={600}>
              {user.displayName}
            </Typography>
          }
          secondary={
            <Typography variant="caption" color="text.secondary">
              {user.username} • {user.email}
            </Typography>
          }
        />
        <ArrowIcon sx={{ color: '#9ca3af', fontSize: '18px' }} />
      </ListItemButton>
    </ListItem>
  );

  const hasResults = searchState.results && searchState.results.total > 0;
  const projectStartIndex = 0;
  const issueStartIndex = searchState.results?.projects.length || 0;
  const userStartIndex = issueStartIndex + (searchState.results?.issues.length || 0);

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // Allow closing on backdrop click and escape key
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          handleClose();
        }
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        onClick: (e) => {
          // Prevent closing when clicking inside the dialog paper
          e.stopPropagation();
        },
        sx: {
          borderRadius: '12px',
          maxHeight: '80vh',
          margin: 2,
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Search Input */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
          <TextField
            inputRef={inputRef}
            fullWidth
            placeholder={t('searchModal.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setQuery('')}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                fontSize: '16px',
                '&::placeholder': {
                  color: '#9ca3af',
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
        </Box>

        {/* Results */}
        <Box
          ref={resultsRef}
          sx={{
            maxHeight: '60vh',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#d1d5db',
              borderRadius: '4px',
            },
          }}
        >
          {searchState.loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {!searchState.loading && !query && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                {t('searchModal.hint')}
              </Typography>
            </Box>
          )}

          {!searchState.loading && query && !hasResults && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('searchModal.noResults', { query })}
              </Typography>
            </Box>
          )}

          {!searchState.loading && hasResults && (
            <List disablePadding>
              {/* Projects */}
              {searchState.results!.projects.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 1, backgroundColor: '#f9fafb' }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                      📁 PROJECTS ({searchState.results!.projects.length})
                    </Typography>
                  </Box>
                  {searchState.results!.projects.map((project, idx) =>
                    renderProject(project, projectStartIndex + idx),
                  )}
                  {searchState.results!.issues.length > 0 && <Divider />}
                </>
              )}

              {/* Issues */}
              {searchState.results!.issues.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 1, backgroundColor: '#f9fafb' }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                      {t('searchModal.sectionIssues', { count: searchState.results!.issues.length })}
                    </Typography>
                  </Box>
                  {searchState.results!.issues.map((issue, idx) =>
                    renderIssue(issue, issueStartIndex + idx, issueStartIndex),
                  )}
                  {searchState.results!.users.length > 0 && <Divider />}
                </>
              )}

              {/* Users */}
              {searchState.results!.users.length > 0 && (
                <>
                  <Box sx={{ px: 2, py: 1, backgroundColor: '#f9fafb' }}>
                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                      {t('searchModal.sectionUsers', { count: searchState.results!.users.length })}
                    </Typography>
                  </Box>
                  {searchState.results!.users.map((user, idx) =>
                    renderUser(user, userStartIndex + idx, userStartIndex),
                  )}
                </>
              )}
            </List>
          )}

          {searchState.error && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="error">
                {t('searchModal.failed')}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;


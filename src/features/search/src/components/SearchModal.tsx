import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogContent,
  Box,
  Grid,
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
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Tune as TuneIcon,
  Folder as ProjectIcon,
  BugReport as IssueIcon,
  Person as UserIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchActions, useSelectorSearch } from '../store';
import type { SearchFilters } from '../store/api';
import type { SearchProject, SearchIssue, SearchUser } from '../store/states';
import { projectsApi } from '../../../projects/src/store/api';
import { referenceDataApi } from '../../../reference-data/src/store/api';
import { usersApi } from '../../../users/src/store/api';
import { issuesApi } from '../../../issues/src/store/api';

export interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  type SelectOption = { value: string; label: string; helperText?: string; fullLabel?: string };
  const truncateText = (text: string, maxLength = 60): string =>
    text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchState = useSelectorSearch((state) => state);
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    projectKeys: [],
    projectTypes: [],
    issueStatusIds: [],
    issuePriorityIds: [],
    assigneeIds: [],
    issueKeys: [],
  });
  const [projectKeyOptions, setProjectKeyOptions] = useState<SelectOption[]>([]);
  const [projectTypeOptions, setProjectTypeOptions] = useState<SelectOption[]>([]);
  const [issueStatusOptions, setIssueStatusOptions] = useState<SelectOption[]>([]);
  const [issuePriorityOptions, setIssuePriorityOptions] = useState<SelectOption[]>([]);
  const [assigneeOptions, setAssigneeOptions] = useState<SelectOption[]>([]);
  const [issueKeyOptions, setIssueKeyOptions] = useState<SelectOption[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const resetSearchState = useCallback(() => {
    setQuery('');
    setShowFilters(false);
    setFilters({
      projectKeys: [],
      projectTypes: [],
      issueStatusIds: [],
      issuePriorityIds: [],
      assigneeIds: [],
      issueKeys: [],
    });
    setSelectedIndex(0);
    dispatch(searchActions.clearSearch());
  }, [dispatch]);

  const handleClose = () => {
    onClose();
  };

  const renderFilterOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: SelectOption,
    selected: boolean,
  ) => (
    <li {...props} title={option.fullLabel || option.label}>
      <Checkbox
        icon={icon}
        checkedIcon={checkedIcon}
        checked={selected}
        sx={{ mr: 1, mt: 0.25 }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.15, py: 0.25 }}>
        <Typography sx={{ fontSize: '13px', lineHeight: 1.35, fontWeight: 500 }}>
          {option.label}
        </Typography>
        {option.helperText && (
          <Typography sx={{ fontSize: '11px', lineHeight: 1.25 }} color="text.secondary">
            {option.helperText}
          </Typography>
        )}
      </Box>
    </li>
  );

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }

    if (!open) {
      const resetTimeout = window.setTimeout(() => {
        resetSearchState();
      }, 0);
      return () => window.clearTimeout(resetTimeout);
    }
  }, [open, resetSearchState]);

  useEffect(() => {
    if (!open) return;

    let mounted = true;
    const loadFilterOptions = async () => {
      try {
        const [projectsRes, statusesRes, prioritiesRes, usersRes] = await Promise.all([
          projectsApi.getProjects(),
          referenceDataApi.getStatuses(),
          referenceDataApi.getPriorities(),
          usersApi.getUsers(),
        ]);
        if (!mounted) return;

        const projectKeys = (projectsRes.data || [])
          .filter((project) => !!project.key)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((project) => ({
            value: project.key,
            label: project.name || project.key,
            helperText: project.key,
          }));

        const projectTypes = Array.from(
          new Set((projectsRes.data || []).map((project) => project.type).filter(Boolean)),
        )
          .sort((a, b) => a.localeCompare(b))
          .map((value) => ({ value, label: value }));

        const statuses = (statusesRes.data || [])
          .map((status) => ({ value: status.id, label: status.name }))
          .sort((a, b) => a.label.localeCompare(b.label));

        const priorities = (prioritiesRes.data || [])
          .map((priority) => ({ value: priority.id, label: priority.name }))
          .sort((a, b) => a.label.localeCompare(b.label));

        const assignees = (usersRes.data || [])
          .map((user) => ({
            value: user.id,
            label: `${user.displayName} (${user.username})`,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        const issuesResponses = await Promise.all(
          (projectsRes.data || []).map((project) =>
            issuesApi.getIssues({ projectId: project.id }).catch(() => ({ data: [] })),
          ),
        );
        const issueKeyMap = new Map<string, SelectOption>();
        issuesResponses
          .flatMap((response) => response.data || [])
          .forEach((issue) => {
            if (!issue.key) return;
            const fullSummary = issue.summary?.trim() || issue.key;
            issueKeyMap.set(issue.key, {
              value: issue.key,
              label: truncateText(fullSummary),
              fullLabel: fullSummary,
              helperText: issue.key,
            });
          });
        const issueKeys = Array.from(issueKeyMap.values()).sort((a, b) =>
          (a.fullLabel || a.label).localeCompare(b.fullLabel || b.label),
        );

        setProjectKeyOptions(projectKeys);
        setProjectTypeOptions(projectTypes);
        setIssueStatusOptions(statuses);
        setIssuePriorityOptions(priorities);
        setAssigneeOptions(assignees);
        setIssueKeyOptions(issueKeys);
      } catch (error) {
        // Keep modal usable if option loading fails.
        if (!mounted) return;
        setProjectKeyOptions([]);
        setProjectTypeOptions([]);
        setIssueStatusOptions([]);
        setIssuePriorityOptions([]);
        setAssigneeOptions([]);
        setIssueKeyOptions([]);
      }
    };

    void loadFilterOptions();
    return () => {
      mounted = false;
    };
  }, [open]);

  const normalizedFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filters).filter(
          ([, value]) => Array.isArray(value) && value.length > 0,
        ),
      ) as SearchFilters,
    [filters],
  );

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((value) => Array.isArray(value) && value.length > 0),
    [filters],
  );

  const canTriggerSearch = query.trim().length > 0 || hasActiveFilters;
  const clearAllFilters = () =>
    setFilters({
      projectKeys: [],
      projectTypes: [],
      issueStatusIds: [],
      issuePriorityIds: [],
      assigneeIds: [],
      issueKeys: [],
    });

  const handleSearch = () => {
    if (!canTriggerSearch) {
      dispatch(searchActions.clearSearch());
      return;
    }

    dispatch(
      searchActions.searchRequest({
        query: query.trim(),
        type: 'all',
        limit: 20,
        filters: normalizedFilters,
      }),
    );
    setSelectedIndex(0);
  };

  const handleToggleFilters = () => {
    setShowFilters((prev) => {
      const next = !prev;
      if (!next) {
        clearAllFilters();
        if (query.trim().length > 0) {
          dispatch(
            searchActions.searchRequest({
              query: query.trim(),
              type: 'all',
              limit: 20,
            }),
          );
        } else {
          dispatch(searchActions.clearSearch());
        }
      }
      return next;
    });
  };

  // Keep instant search only for typing query.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length > 0) {
        handleSearch();
      } else {
        dispatch(searchActions.clearSearch());
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

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

  const renderIssue = (issue: SearchIssue, index: number) => (
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

  const renderUser = (user: SearchUser, index: number) => (
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
      transitionDuration={{ enter: 120, exit: 90 }}
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
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Search Input */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('searchModal.title')}
            </Typography>
            <Button
              size="small"
              startIcon={<TuneIcon fontSize="small" />}
              onClick={handleToggleFilters}
            >
              {showFilters ? t('searchModal.hideFilters') : t('searchModal.showFilters')}
            </Button>
          </Box>
          {!showFilters && (
            <TextField
              inputRef={inputRef}
              fullWidth
              placeholder={t('searchModal.placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSearch();
                }
              }}
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
          )}
          <Collapse in={showFilters}>
            <Grid container spacing={1.25} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  size="small"
                  options={projectKeyOptions}
                  value={projectKeyOptions.filter((item) =>
                    (filters.projectKeys || []).includes(item.value),
                  )}
                  onChange={(_, selected) =>
                    setFilters((prev) => ({
                      ...prev,
                      projectKeys: selected.map((item) => item.value),
                    }))
                  }
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option, { selected }) =>
                    renderFilterOption(props, option, selected)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label={t('searchModal.filters.projectKey')} />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  size="small"
                  options={projectTypeOptions}
                  value={projectTypeOptions.filter((item) =>
                    (filters.projectTypes || []).includes(item.value),
                  )}
                  onChange={(_, selected) =>
                    setFilters((prev) => ({
                      ...prev,
                      projectTypes: selected.map((item) => item.value),
                    }))
                  }
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option, { selected }) =>
                    renderFilterOption(props, option, selected)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label={t('searchModal.filters.projectType')} />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  size="small"
                  options={issueKeyOptions}
                  value={issueKeyOptions.filter((item) =>
                    (filters.issueKeys || []).includes(item.value),
                  )}
                  onChange={(_, selected) =>
                    setFilters((prev) => ({
                      ...prev,
                      issueKeys: selected.map((item) => item.value),
                    }))
                  }
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option, { selected }) =>
                    renderFilterOption(props, option, selected)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label={t('searchModal.filters.issueKey')} />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  size="small"
                  options={issueStatusOptions}
                  value={issueStatusOptions.filter((item) =>
                    (filters.issueStatusIds || []).includes(item.value),
                  )}
                  onChange={(_, selected) =>
                    setFilters((prev) => ({
                      ...prev,
                      issueStatusIds: selected.map((item) => item.value),
                    }))
                  }
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option, { selected }) =>
                    renderFilterOption(props, option, selected)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label={t('searchModal.filters.issueStatus')} />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  size="small"
                  options={issuePriorityOptions}
                  value={issuePriorityOptions.filter((item) =>
                    (filters.issuePriorityIds || []).includes(item.value),
                  )}
                  onChange={(_, selected) =>
                    setFilters((prev) => ({
                      ...prev,
                      issuePriorityIds: selected.map((item) => item.value),
                    }))
                  }
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option, { selected }) =>
                    renderFilterOption(props, option, selected)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label={t('searchModal.filters.issuePriority')} />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  size="small"
                  options={assigneeOptions}
                  value={assigneeOptions.filter((item) =>
                    (filters.assigneeIds || []).includes(item.value),
                  )}
                  onChange={(_, selected) =>
                    setFilters((prev) => ({
                      ...prev,
                      assigneeIds: selected.map((item) => item.value),
                    }))
                  }
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option, { selected }) =>
                    renderFilterOption(props, option, selected)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label={t('searchModal.filters.assignee')} />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    disabled={!hasActiveFilters}
                    onClick={clearAllFilters}
                  >
                    {t('searchModal.clearFilters')}
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<SearchIcon fontSize="small" />}
                    onClick={handleSearch}
                    disabled={!canTriggerSearch}
                    sx={{ ml: 1 }}
                  >
                    {t('searchModal.searchNow')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Collapse>
        </Box>

        {/* Results */}
        <Box
          ref={resultsRef}
          sx={{
            flex: 1,
            minHeight: 0,
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
          {!searchState.loading && hasResults && (
            <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #f1f5f9', backgroundColor: '#ffffff' }}>
              <Typography variant="caption" color="text.secondary">
                {t('searchModal.topResultsHint')}
              </Typography>
            </Box>
          )}

          {searchState.loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {!searchState.loading && !query && !hasResults && (
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
                    renderIssue(issue, issueStartIndex + idx),
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
                    renderUser(user, userStartIndex + idx),
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


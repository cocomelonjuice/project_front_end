import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Container,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  ContentCopy as ContentCopyIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { CreateProjectModal, EditProjectModal, DeleteProjectDialog } from '../features/projects/src/components';
import { projectsActions, useSelectorProjects } from '../features/projects/src/store';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_BUTTON_STYLES, UI_INPUT_STYLES } from '../shared/constants/src/ui';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projectsState = useSelectorProjects((state) => state);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectSortOrder, setProjectSortOrder] = useState<'asc' | 'desc'>('desc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<any>(null);

  // Fetch projects on mount
  useEffect(() => {
    dispatch(
      projectsActions.getProjectsRequest({
        callback: {
          onError: (error: any) => {
            console.error('Failed to fetch projects:', error);
          },
        },
      } as any)
    );
  }, [dispatch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, projectId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(projectId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleView = () => {
    handleMenuClose();
    if (selectedProject) {
      navigate(`/projects/${selectedProject}`);
    }
  };

  const handleProjectCreated = () => {
    // Refresh projects list after creation
    dispatch(
      projectsActions.getProjectsRequest({
        callback: {
          onError: (error: any) => {
            console.error('Failed to refresh projects:', error);
          },
        },
      } as any)
    );
  };

  const handleEdit = () => {
    handleMenuClose();
    if (selectedProject) {
      const project = projectsState.projects.find((p) => p.id === selectedProject);
      if (project) {
        setProjectToEdit(project);
        setEditModalOpen(true);
      }
    }
  };

  const handleProjectUpdated = () => {
    // Refresh projects list after update
    dispatch(
      projectsActions.getProjectsRequest({
        callback: {
          onError: (error: any) => {
            console.error('Failed to refresh projects:', error);
          },
        },
      } as any)
    );
  };

  const handleDelete = () => {
    handleMenuClose();
    if (selectedProject) {
      const project = projectsState.projects.find((p) => p.id === selectedProject);
      if (project) {
        setProjectToDelete(project);
        setDeleteDialogOpen(true);
      }
    }
  };

  const handleProjectDeleted = () => {
    // Projects list will be updated by Redux reducer
    // No need to manually refresh
  };

  const existingKeys = projectsState.projects.map((p) => p.key.toUpperCase());

  const [copiedProjectKey, setCopiedProjectKey] = useState<string | null>(null);

  const projectTypeLabel = (type: string) => {
    const normalized = String(type || '').toLowerCase();
    if (!normalized) return '-';
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const filteredProjects = projectsState.projects.filter((project) => {
    const query = searchQuery.toLowerCase();
    return (
      project.name.toLowerCase().includes(query) ||
      project.key.toLowerCase().includes(query) ||
      (project.description && project.description.toLowerCase().includes(query))
    );
  });

  const sortedProjects = React.useMemo(() => {
    const projects = [...filteredProjects];
    projects.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return projectSortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });
    return projects;
  }, [filteredProjects, projectSortOrder]);

  const handleProjectCreatedAtSort = () => {
    setProjectSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const formatDateDDMMYYYY = (value?: string) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCopyProjectKey = async (projectKey: string) => {
    try {
      await navigator.clipboard.writeText(projectKey);
      setCopiedProjectKey(projectKey);
      setTimeout(() => {
        setCopiedProjectKey((prev) => (prev === projectKey ? null : prev));
      }, 1200);
    } catch (error) {
      console.error('Failed to copy project key:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
            color: UI_COLORS.text.primary,
            fontSize: { xs: UI_TYPOGRAPHY.fontSize['2xl'], md: UI_TYPOGRAPHY.fontSize['3xl'] },
          }}
        >
          {t('home.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{
            ...UI_BUTTON_STYLES.primary,
            borderRadius: UI_BORDER_RADIUS.md,
            px: 3,
            py: 1.5,
            fontSize: UI_TYPOGRAPHY.fontSize.base,
            fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
            textTransform: 'none',
            boxShadow: UI_SHADOWS.md,
          }}
        >
          {t('home.createProject')}
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder={t('home.searchPlaceholder')}
          value={searchQuery}
          onChange={handleSearch}
          sx={UI_INPUT_STYLES.default}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: UI_COLORS.text.secondary }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Projects Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: UI_BORDER_RADIUS.lg,
          boxShadow: UI_SHADOWS.md,
          border: `1px solid ${UI_COLORS.border.light}`,
          overflow: 'auto',
          maxHeight: { xs: 420, md: 560 },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: UI_COLORS.background.subtle,
              }}
            >
              <TableCell
                sx={{
                  fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                  color: UI_COLORS.text.primary,
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                }}
              >
                {t('home.colName')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                  color: UI_COLORS.text.primary,
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                }}
              >
                {t('home.colKey')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                  color: UI_COLORS.text.primary,
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                }}
              >
                {t('home.colType')}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                  color: UI_COLORS.text.primary,
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                }}
              >
                <TableSortLabel
                  active
                  direction={projectSortOrder}
                  onClick={handleProjectCreatedAtSort}
                >
                  {t('home.colCreatedAt')}
                </TableSortLabel>
              </TableCell>
              <TableCell width={50} sx={{ fontWeight: UI_TYPOGRAPHY.fontWeight.semibold, color: UI_COLORS.text.primary, fontSize: UI_TYPOGRAPHY.fontSize.sm }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectsState.getProjectsLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} sx={{ color: UI_COLORS.primary.main }} />
                </TableCell>
              </TableRow>
            ) : sortedProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery ? t('home.emptySearch') : t('home.empty')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedProjects.map((project) => (
                <TableRow
                  key={project.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: UI_COLORS.background.hover,
                    },
                    transition: 'background-color 0.2s ease-in-out',
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: UI_BORDER_RADIUS.md,
                          bgcolor: UI_COLORS.primary.main,
                          color: UI_COLORS.primary.contrast,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: UI_TYPOGRAPHY.fontSize.sm,
                          fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
                          boxShadow: UI_SHADOWS.sm,
                        }}
                      >
                        {project.key.charAt(0)}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: UI_COLORS.primary.main,
                          fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        {project.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: UI_COLORS.text.secondary,
                          fontSize: UI_TYPOGRAPHY.fontSize.sm,
                          fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                        }}
                      >
                        {project.key}
                      </Typography>
                      <Tooltip title={copiedProjectKey === project.key ? 'Copied' : 'Copy key'}>
                        <IconButton
                          size="small"
                          onClick={() => handleCopyProjectKey(project.key)}
                          sx={{
                            color: UI_COLORS.text.secondary,
                            '&:hover': {
                              color: UI_COLORS.primary.main,
                              backgroundColor: UI_COLORS.background.hover,
                            },
                          }}
                        >
                          <ContentCopyIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: UI_COLORS.text.secondary,
                      fontSize: UI_TYPOGRAPHY.fontSize.sm,
                    }}
                  >
                    {projectTypeLabel(project.type)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: UI_COLORS.text.secondary,
                      fontSize: UI_TYPOGRAPHY.fontSize.sm,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatDateDDMMYYYY(project.createdAt)}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, project.id)}
                      sx={{
                        color: UI_COLORS.text.secondary,
                        '&:hover': {
                          backgroundColor: UI_COLORS.background.hover,
                          color: UI_COLORS.text.primary,
                        },
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedProject === project.id}
                      onClose={handleMenuClose}
                      PaperProps={{
                        sx: {
                          borderRadius: UI_BORDER_RADIUS.md,
                          boxShadow: UI_SHADOWS.lg,
                          mt: 1,
                          minWidth: 150,
                        },
                      }}
                    >
                      <MenuItem
                        onClick={handleView}
                        sx={{
                          fontSize: UI_TYPOGRAPHY.fontSize.sm,
                          '&:hover': {
                            backgroundColor: UI_COLORS.background.hover,
                          },
                        }}
                      >
                        <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                        {t('home.view')}
                      </MenuItem>
                      <MenuItem
                        onClick={handleEdit}
                        sx={{
                          fontSize: UI_TYPOGRAPHY.fontSize.sm,
                          '&:hover': {
                            backgroundColor: UI_COLORS.background.hover,
                          },
                        }}
                      >
                        <EditIcon fontSize="small" sx={{ mr: 1 }} />
                        {t('home.edit')}
                      </MenuItem>
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
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        {t('home.delete')}
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination placeholder */}
      {projectsState.projects.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: UI_COLORS.text.secondary,
              fontSize: UI_TYPOGRAPHY.fontSize.sm,
            }}
          >
            {t('home.showing', {
              current: filteredProjects.length,
              total: projectsState.projects.length,
            })}
          </Typography>
        </Box>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
        existingKeys={existingKeys}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setProjectToEdit(null);
        }}
        project={projectToEdit}
        onProjectUpdated={handleProjectUpdated}
        existingKeys={existingKeys}
      />

      {/* Delete Project Dialog */}
      <DeleteProjectDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setProjectToDelete(null);
        }}
        project={projectToDelete}
        onProjectDeleted={handleProjectDeleted}
      />
    </Container>
  );
};

export default Home;

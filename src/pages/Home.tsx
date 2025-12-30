import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { CreateProjectModal, EditProjectModal, DeleteProjectDialog } from '../features/projects/src/components';
import { projectsActions, useSelectorProjects } from '../features/projects/src/store';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projectsState = useSelectorProjects((state) => state);
  const [searchQuery, setSearchQuery] = useState('');
  const [starredProjects, setStarredProjects] = useState<Set<string>>(new Set());
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

  const handleStarToggle = (projectId: string) => {
    setStarredProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
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

  const filteredProjects = projectsState.projects.filter((project) => {
    const query = searchQuery.toLowerCase();
    return (
      project.name.toLowerCase().includes(query) ||
      project.key.toLowerCase().includes(query) ||
      (project.description && project.description.toLowerCase().includes(query))
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create project
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search projects..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Projects Table */}
      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Key</TableCell>
              <TableCell>Type</TableCell>
              <TableCell width={50}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectsState.getProjectsLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {searchQuery ? 'No projects match your search.' : 'No projects found.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleStarToggle(project.id)}
                        sx={{ p: 0.5 }}
                      >
                        {starredProjects.has(project.id) ? (
                          <StarIcon fontSize="small" color="warning" />
                        ) : (
                          <StarBorderIcon fontSize="small" />
                        )}
                      </IconButton>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {project.key.charAt(0)}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        {project.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={project.key} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{project.type}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, project.id)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedProject === project.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleView}>View</MenuItem>
                      <MenuItem onClick={handleEdit}>Edit</MenuItem>
                      <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                        Delete
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
      {!searchQuery && filteredProjects.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredProjects.length} of {projectsState.projects.length} projects
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
    </Box>
  );
};

export default Home;

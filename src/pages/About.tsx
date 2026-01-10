import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  Container,
} from '@mui/material';
import {
  AccountTree as ProjectsIcon,
  Assignment as IssuesIcon,
  Timeline as WorkflowsIcon,
  People as TeamIcon,
  Dashboard as BoardsIcon,
  Speed as SprintsIcon,
} from '@mui/icons-material';
import { APP_CONFIG } from '../shared/constants/src/config';

const About = () => {
  const features = [
    {
      icon: <ProjectsIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Project Management',
      description: 'Create, organize, and manage multiple projects with ease. Track progress, set deadlines, and collaborate with your team.',
    },
    {
      icon: <IssuesIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Issue Tracking',
      description: 'Track bugs, tasks, and feature requests. Assign issues to team members, set priorities, and monitor progress.',
    },
    {
      icon: <WorkflowsIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Custom Workflows',
      description: 'Define custom workflows and status transitions to match your team\'s unique processes and methodologies.',
    },
    {
      icon: <BoardsIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Kanban Boards',
      description: 'Visualize your work with Kanban boards. Drag and drop issues between columns to track progress in real-time.',
    },
    {
      icon: <SprintsIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Sprint Planning',
      description: 'Plan and execute sprints efficiently. Organize issues into sprints, track velocity, and manage your agile workflow.',
    },
    {
      icon: <TeamIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Team Collaboration',
      description: 'Manage team members, assign roles, and control permissions. Keep everyone aligned and productive.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: 6,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: 'text.primary',
          }}
        >
          About {APP_CONFIG.NAME}
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: 700,
            mx: 'auto',
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          A powerful, modern project management platform designed to help teams collaborate,
          track progress, and deliver exceptional results.
        </Typography>
      </Box>

      {/* Main Description */}
      <Paper
        elevation={2}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 5,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="body1"
          paragraph
          sx={{
            fontSize: '1.125rem',
            lineHeight: 1.8,
            textAlign: 'left',
            mb: 2,
          }}
        >
          {APP_CONFIG.NAME} is a comprehensive project management solution that empowers teams to
          work smarter, faster, and more efficiently. Whether you're managing software development
          projects, coordinating cross-functional teams, or tracking complex workflows, our platform
          provides the tools you need to succeed.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1.125rem',
            lineHeight: 1.8,
            textAlign: 'left',
          }}
        >
          Built with modern technology and user experience in mind, {APP_CONFIG.NAME} combines
          powerful features with an intuitive interface. From issue tracking to sprint planning,
          from team management to custom workflows, everything you need is at your fingertips.
        </Typography>
      </Paper>

      {/* Features Grid */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 4,
            textAlign: 'center',
            color: 'text.primary',
          }}
        >
          Key Features
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: '100%',
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 3,
                  p: 3,
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {feature.icon}
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      textAlign: 'left',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      textAlign: 'left',
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 5 }} />

      {/* Additional Info */}
      <Paper
        elevation={1}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            width: '100%',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2.5,
                color: 'text.primary',
              }}
            >
              Why Choose {APP_CONFIG.NAME}?
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  lineHeight: 1.7,
                }}
              >
                <Box component="span" sx={{ mr: 1, color: 'primary.main', fontWeight: 'bold' }}>
                  •
                </Box>
                Streamline your project management workflow with intuitive tools
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  lineHeight: 1.7,
                }}
              >
                <Box component="span" sx={{ mr: 1, color: 'primary.main', fontWeight: 'bold' }}>
                  •
                </Box>
                Improve team collaboration with real-time updates and notifications
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  lineHeight: 1.7,
                }}
              >
                <Box component="span" sx={{ mr: 1, color: 'primary.main', fontWeight: 'bold' }}>
                  •
                </Box>
                Customize workflows to match your team's unique processes
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  lineHeight: 1.7,
                }}
              >
                <Box component="span" sx={{ mr: 1, color: 'primary.main', fontWeight: 'bold' }}>
                  •
                </Box>
                Track progress and make data-driven decisions
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2.5,
                color: 'text.primary',
              }}
            >
              Get Started
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{
                lineHeight: 1.7,
                mb: 2,
              }}
            >
              Ready to transform how your team manages projects? Start by creating your first
              project, invite team members, and begin tracking your work. Our platform is designed
              to scale with your needs, from small teams to large enterprises.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.7,
              }}
            >
              For administrative tasks, user management, and system configuration, visit the
              Admin Dashboard to customize your experience.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default About; 
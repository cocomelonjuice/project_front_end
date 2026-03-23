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
import { useTranslation } from 'react-i18next';
import { APP_CONFIG } from '../shared/constants/src/config';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_TRANSITIONS } from '../shared/constants/src/ui';

const FEATURE_ICON_SX = { fontSize: 48, color: 'primary.main' as const };

const FEATURE_CONFIG = [
  { key: 'projectManagement' as const, icon: <ProjectsIcon sx={FEATURE_ICON_SX} /> },
  { key: 'issueTracking' as const, icon: <IssuesIcon sx={FEATURE_ICON_SX} /> },
  { key: 'customWorkflows' as const, icon: <WorkflowsIcon sx={FEATURE_ICON_SX} /> },
  { key: 'kanbanBoards' as const, icon: <BoardsIcon sx={FEATURE_ICON_SX} /> },
  { key: 'sprintPlanning' as const, icon: <SprintsIcon sx={FEATURE_ICON_SX} /> },
  { key: 'teamCollaboration' as const, icon: <TeamIcon sx={FEATURE_ICON_SX} /> },
];

const About = () => {
  const { t } = useTranslation();
  const appName = APP_CONFIG.NAME;

  const features = FEATURE_CONFIG.map(({ key, icon }) => ({
    icon,
    title: t(`about.features.${key}.title`),
    description: t(`about.features.${key}.description`),
  }));

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
            fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
            mb: 2,
            color: UI_COLORS.text.primary,
            fontSize: { xs: UI_TYPOGRAPHY.fontSize['2xl'], md: UI_TYPOGRAPHY.fontSize['3xl'] },
          }}
        >
          {t('about.title', { name: appName })}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            maxWidth: 700,
            mx: 'auto',
            lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
            fontWeight: UI_TYPOGRAPHY.fontWeight.normal,
            color: UI_COLORS.text.secondary,
            fontSize: { xs: UI_TYPOGRAPHY.fontSize.base, md: UI_TYPOGRAPHY.fontSize.lg },
          }}
        >
          {t('about.subtitle')}
        </Typography>
      </Box>

      {/* Main Description */}
      <Paper
        elevation={2}
        sx={{
          p: { xs: 3, md: 5 },
          mb: 5,
          borderRadius: UI_BORDER_RADIUS.xl,
          boxShadow: UI_SHADOWS.lg,
        }}
      >
        <Typography
          variant="body1"
          paragraph
          sx={{
            fontSize: UI_TYPOGRAPHY.fontSize.lg,
            lineHeight: UI_TYPOGRAPHY.lineHeight.loose,
            textAlign: 'left',
            mb: 2,
            color: UI_COLORS.text.primary,
          }}
        >
          {t('about.body1', { name: appName })}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: UI_TYPOGRAPHY.fontSize.lg,
            lineHeight: UI_TYPOGRAPHY.lineHeight.loose,
            textAlign: 'left',
            color: UI_COLORS.text.primary,
          }}
        >
          {t('about.body2', { name: appName })}
        </Typography>
      </Paper>

      {/* Features Grid */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
            mb: 4,
            textAlign: 'center',
            color: UI_COLORS.text.primary,
            fontSize: { xs: UI_TYPOGRAPHY.fontSize.xl, md: UI_TYPOGRAPHY.fontSize['2xl'] },
          }}
        >
          {t('about.keyFeatures')}
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
                transition: `transform ${UI_TRANSITIONS.normal}, box-shadow ${UI_TRANSITIONS.normal}`,
                borderRadius: UI_BORDER_RADIUS.xl,
                boxShadow: UI_SHADOWS.md,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: UI_SHADOWS['2xl'],
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
                      fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                      mb: 1,
                      textAlign: 'left',
                      color: UI_COLORS.text.primary,
                      fontSize: UI_TYPOGRAPHY.fontSize.xl,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: 'left',
                      lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
                      color: UI_COLORS.text.secondary,
                      fontSize: UI_TYPOGRAPHY.fontSize.base,
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
          borderRadius: UI_BORDER_RADIUS.xl,
          boxShadow: UI_SHADOWS.md,
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
                fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                mb: 2.5,
                color: UI_COLORS.text.primary,
                fontSize: { xs: UI_TYPOGRAPHY.fontSize.xl, md: UI_TYPOGRAPHY.fontSize['2xl'] },
              }}
            >
              {t('about.whyTitle', { name: appName })}
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
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
                  color: UI_COLORS.text.secondary,
                  fontSize: UI_TYPOGRAPHY.fontSize.base,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    mr: 1,
                    color: UI_COLORS.primary.main,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
                  }}
                >
                  •
                </Box>
                {t('about.whyBullet1')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
                  color: UI_COLORS.text.secondary,
                  fontSize: UI_TYPOGRAPHY.fontSize.base,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    mr: 1,
                    color: UI_COLORS.primary.main,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
                  }}
                >
                  •
                </Box>
                {t('about.whyBullet2')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
                  color: UI_COLORS.text.secondary,
                  fontSize: UI_TYPOGRAPHY.fontSize.base,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    mr: 1,
                    color: UI_COLORS.primary.main,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
                  }}
                >
                  •
                </Box>
                {t('about.whyBullet3')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
                  color: UI_COLORS.text.secondary,
                  fontSize: UI_TYPOGRAPHY.fontSize.base,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    mr: 1,
                    color: UI_COLORS.primary.main,
                    fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
                  }}
                >
                  •
                </Box>
                {t('about.whyBullet4')}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                mb: 2.5,
                color: UI_COLORS.text.primary,
                fontSize: { xs: UI_TYPOGRAPHY.fontSize.xl, md: UI_TYPOGRAPHY.fontSize['2xl'] },
              }}
            >
              {t('about.getStartedTitle')}
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{
                lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
                mb: 2,
                color: UI_COLORS.text.secondary,
                fontSize: UI_TYPOGRAPHY.fontSize.base,
              }}
            >
              {t('about.getStartedP1')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: UI_TYPOGRAPHY.lineHeight.relaxed,
                color: UI_COLORS.text.secondary,
                fontSize: UI_TYPOGRAPHY.fontSize.base,
              }}
            >
              {t('about.getStartedP2')}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default About; 
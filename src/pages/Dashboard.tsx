import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tooltip as MuiTooltip,
  Typography,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  WarningAmber as WarningAmberIcon,
  CheckCircle as CheckCircleIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useSelectorNotifications } from '../features/notifications/src/store';
import { useSelectorAuth } from '../features/auth/src/store';
import issuesApi from '../features/issues/src/store/api';
import type { Issue } from '../features/issues/src/store/states';
import projectsApi from '../features/projects/src/store/api';
import type { Project } from '../features/projects/src/store/states';
import { isPastDueDate } from '../shared/utils/src';

const STATUS_COLORS = ['#475569', '#1d4ed8', '#15803d'];
const PRIORITY_HIGH = ['highest', 'high'];
const KPI_STYLE = {
  open: {
    bg: 'rgba(59,130,246,0.14)',
    iconBg: 'rgba(59,130,246,0.24)',
    iconColor: '#2563eb',
    border: 'rgba(59,130,246,0.34)',
  },
  attention: {
    bg: 'rgba(245,158,11,0.16)',
    iconBg: 'rgba(245,158,11,0.28)',
    iconColor: '#d97706',
    border: 'rgba(245,158,11,0.36)',
  },
  done: {
    bg: 'rgba(34,197,94,0.14)',
    iconBg: 'rgba(34,197,94,0.24)',
    iconColor: '#15803d',
    border: 'rgba(34,197,94,0.34)',
  },
  notif: {
    bg: 'rgba(148,163,184,0.2)',
    iconBg: 'rgba(148,163,184,0.34)',
    iconColor: '#475569',
    border: 'rgba(148,163,184,0.44)',
  },
} as const;

type DashboardDataState = {
  projects: Project[];
  issues: Issue[];
};
type ChartRange = 'all' | '6m' | '3m' | '1m' | '14d';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useSelectorAuth((state) => state);
  const notificationsState = useSelectorNotifications((state) => state);
  const { notifications, unreadCount } = notificationsState;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardDataState>({ projects: [], issues: [] });
  const [chartRange, setChartRange] = useState<ChartRange>('14d');

  useEffect(() => {
    let mounted = true;
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const projectsResponse = await projectsApi.getProjects();
        const projects = projectsResponse.data ?? [];
        const issueResponses = await Promise.all(
          projects.map((project) => issuesApi.getIssues({ projectId: project.id })),
        );
        const issues = issueResponses.flatMap((res) => res.data ?? []);

        if (mounted) {
          setData({ projects, issues });
        }
      } catch (err) {
        if (mounted) {
          const message = err instanceof Error ? err.message : String(err);
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    void loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  const currentUserId = auth.user?.id;

  const myIssues = useMemo(
    () => data.issues.filter((issue) => issue.assigneeId && issue.assigneeId === currentUserId),
    [data.issues, currentUserId],
  );

  const myOpenIssues = useMemo(
    () =>
      myIssues.filter(
        (issue) => (issue.status?.category ?? '').toLowerCase() !== 'done',
      ),
    [myIssues],
  );

  const myHighPriorityIssues = useMemo(
    () =>
      myOpenIssues.filter((issue) =>
        PRIORITY_HIGH.includes((issue.priority?.name ?? '').toLowerCase()),
      ),
    [myOpenIssues],
  );

  const completedThisWeek = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 7);
    return myIssues.filter((issue) => {
      const isDone = (issue.status?.category ?? '').toLowerCase() === 'done';
      const updated = new Date(issue.updatedAt);
      return isDone && !Number.isNaN(updated.getTime()) && updated >= start;
    });
  }, [myIssues]);

  const recentMyIssues = useMemo(
    () =>
      [...myOpenIssues]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 5),
    [myOpenIssues],
  );

  const recentActivity = useMemo(
    () =>
      [...notifications]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 8),
    [notifications],
  );

  const projectSnapshots = useMemo(() => {
    const issueCountByProjectId = data.issues.reduce<Record<string, number>>(
      (acc, issue) => {
        acc[issue.projectId] = (acc[issue.projectId] ?? 0) + 1;
        return acc;
      },
      {},
    );
    return data.projects
      .map((project) => ({
        ...project,
        issueCount: issueCountByProjectId[project.id] ?? 0,
      }))
      .sort((a, b) => b.issueCount - a.issueCount)
      .slice(0, 5);
  }, [data.issues, data.projects]);

  const filteredChartIssues = useMemo(() => {
    if (chartRange === 'all') return data.issues;
    const now = new Date();
    const from = new Date(now);
    if (chartRange === '14d') from.setDate(now.getDate() - 14);
    else if (chartRange === '1m') from.setMonth(now.getMonth() - 1);
    else if (chartRange === '3m') from.setMonth(now.getMonth() - 3);
    else if (chartRange === '6m') from.setMonth(now.getMonth() - 6);
    return data.issues.filter((issue) => {
      const createdAt = new Date(issue.createdAt);
      if (Number.isNaN(createdAt.getTime())) return false;
      return createdAt >= from;
    });
  }, [chartRange, data.issues]);

  const chartRangeLabel = useMemo(() => {
    if (chartRange === 'all') return t('projectDetail.insights.rangeAll');
    if (chartRange === '6m') return t('projectDetail.insights.range6m');
    if (chartRange === '3m') return t('projectDetail.insights.range3m');
    if (chartRange === '1m') return t('projectDetail.insights.range1m');
    return t('projectDetail.insights.range14d');
  }, [chartRange, t]);

  const statusChartData = useMemo(() => {
    const buckets = { todo: 0, inprogress: 0, done: 0 };
    for (const issue of filteredChartIssues) {
      const category = (issue.status?.category ?? 'todo').toLowerCase();
      if (category === 'done') buckets.done += 1;
      else if (category === 'inprogress') buckets.inprogress += 1;
      else buckets.todo += 1;
    }
    return [
      { key: 'todo', name: t('dashboard.charts.statusTodo'), value: buckets.todo },
      {
        key: 'inprogress',
        name: t('dashboard.charts.statusInProgress'),
        value: buckets.inprogress,
      },
      { key: 'done', name: t('dashboard.charts.statusDone'), value: buckets.done },
    ];
  }, [filteredChartIssues, t]);

  const trendChartData = useMemo(() => {
    const now = new Date();
    const byDay = chartRange === '14d' || chartRange === '1m';
    const bucketCount =
      chartRange === '14d'
        ? 14
        : chartRange === '1m'
          ? 30
          : chartRange === '3m'
            ? 13
            : chartRange === '6m'
              ? 6
              : 12;
    const buckets = new Map<string, number>();
    const labels: string[] = [];
    for (let i = bucketCount - 1; i >= 0; i -= 1) {
      const point = new Date(now);
      if (byDay) point.setDate(now.getDate() - i);
      else point.setMonth(now.getMonth() - i);
      const key = byDay ? point.toISOString().slice(0, 10) : `${point.getFullYear()}-${point.getMonth() + 1}`;
      if (!buckets.has(key)) labels.push(key);
      buckets.set(key, 0);
    }
    filteredChartIssues.forEach((issue) => {
      const created = new Date(issue.createdAt);
      if (Number.isNaN(created.getTime())) return;
      const key = byDay
        ? created.toISOString().slice(0, 10)
        : `${created.getFullYear()}-${created.getMonth() + 1}`;
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      }
    });
    return labels.map((key) => ({
      date: key,
      label: byDay ? key.slice(5) : key,
      value: buckets.get(key) ?? 0,
    }));
  }, [chartRange, filteredChartIssues]);

  const formatDate = (value?: string) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return `${String(date.getDate()).padStart(2, '0')}/${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatDueDate = (value?: string) => {
    if (!value) return t('dashboard.noDueDate');
    return formatDate(value);
  };

  const isIssueOverdue = (issue: Issue) =>
    isPastDueDate(issue.dueDate, issue.status?.category, issue.status?.name);

  const handleIssueNavigate = (issue: Issue) => {
    navigate(`/projects/${issue.projectId}/issues/${issue.id}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {t('dashboard.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('dashboard.subtitle', {
              name:
                auth.user?.displayName ??
                auth.user?.username ??
                t('dashboard.defaultUser'),
            })}
          </Typography>
        </Box>
      </Stack>

      {loading && (
        <Paper sx={{ p: 4, textAlign: 'center', mb: 3 }}>
          <CircularProgress size={28} />
        </Paper>
      )}

      {error && !loading && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('dashboard.loadFailed')}: {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {[
              {
                label: t('dashboard.kpi.myOpenIssues'),
                value: myOpenIssues.length,
                icon: <AssignmentIcon fontSize="small" />,
                style: KPI_STYLE.open,
              },
              {
                label: t('dashboard.kpi.highPriority'),
                value: myHighPriorityIssues.length,
                icon: <WarningAmberIcon fontSize="small" />,
                style: KPI_STYLE.attention,
              },
              {
                label: t('dashboard.kpi.completedThisWeek'),
                value: completedThisWeek.length,
                icon: <CheckCircleIcon fontSize="small" />,
                style: KPI_STYLE.done,
              },
              {
                label: t('dashboard.kpi.unreadNotifications'),
                value: unreadCount,
                icon: <NotificationsIcon fontSize="small" />,
                style: KPI_STYLE.notif,
              },
            ].map((item) => (
              <Grid key={item.label} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                    border: `1px solid ${item.style.border}`,
                    bgcolor: item.style.bg,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 14px 28px rgba(15,23,42,0.12)',
                    },
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600 }}>
                        {item.label}
                      </Typography>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          bgcolor: item.style.iconBg,
                          color: item.style.iconColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </Box>
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: '#0f172a' }}>
                      {item.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper
                sx={{
                  p: 2.5,
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
                  border: '1px solid rgba(148,163,184,0.2)',
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ mb: 1.5 }}
                >
                  <AssignmentIcon fontSize="small" sx={{ color: '#1d4ed8' }} />
                  <Typography
                    variant="h6"
                    sx={{
                      pl: 1.2,
                      borderLeft: '4px solid #1d4ed8',
                      lineHeight: 1.1,
                    }}
                  >
                    {t('dashboard.sections.myOpenIssues')}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ lineHeight: 1.1, fontWeight: 600, color: '#334155' }}>
                    ({myOpenIssues.length})
                  </Typography>
                </Stack>
                {recentMyIssues.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {t('dashboard.empty.noAssigned')}
                  </Typography>
                ) : (
                  <List disablePadding>
                    {recentMyIssues.map((issue, idx) => (
                      <Box key={issue.id}>
                        <ListItemButton
                          onClick={() => handleIssueNavigate(issue)}
                          sx={{
                            px: 1,
                            borderRadius: 1.5,
                            '&:hover': { bgcolor: 'rgba(29,78,216,0.06)' },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <Typography variant="body1">{`${issue.key} - ${issue.summary}`}</Typography>
                                {isIssueOverdue(issue) && (
                                  <MuiTooltip title={t('common.overdueTask')}>
                                    <WarningAmberIcon sx={{ fontSize: 16, color: '#dc2626' }} />
                                  </MuiTooltip>
                                )}
                              </Box>
                            }
                            secondary={`${issue.priority?.name ?? '-'} • ${issue.status?.name ?? '-'} • ${t('dashboard.dueDateLabel')}: ${formatDueDate(
                              issue.dueDate,
                            )} • ${formatDate(issue.updatedAt)}`}
                          />
                        </ListItemButton>
                        {idx < recentMyIssues.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 2.5,
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
                  border: '1px solid rgba(148,163,184,0.2)',
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                  <WarningAmberIcon fontSize="small" sx={{ color: '#d97706' }} />
                    <Typography
                      variant="h6"
                      sx={{
                        pl: 1.2,
                        borderLeft: '4px solid #d97706',
                        lineHeight: 1.1,
                      }}
                    >
                      {t('dashboard.sections.needsAttention')}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ lineHeight: 1.1, fontWeight: 600, color: '#334155' }}>
                      ({myHighPriorityIssues.length})
                    </Typography>
                </Stack>
                {myHighPriorityIssues.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {t('dashboard.empty.noHighPriority')}
                  </Typography>
                ) : (
                  <List disablePadding>
                    {myHighPriorityIssues.slice(0, 5).map((issue, idx) => (
                      <Box key={issue.id}>
                        <ListItemButton
                          onClick={() => handleIssueNavigate(issue)}
                          sx={{
                            px: 1,
                            borderRadius: 1.5,
                            '&:hover': { bgcolor: 'rgba(217,119,6,0.08)' },
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <Typography variant="body1">{issue.key}</Typography>
                                {isIssueOverdue(issue) && (
                                  <MuiTooltip title={t('common.overdueTask')}>
                                    <WarningAmberIcon sx={{ fontSize: 16, color: '#dc2626' }} />
                                  </MuiTooltip>
                                )}
                              </Box>
                            }
                            secondary={`${issue.summary} • ${issue.priority?.name ?? '-'} • ${t('dashboard.dueDateLabel')}: ${formatDueDate(
                              issue.dueDate,
                            )}`}
                          />
                        </ListItemButton>
                        {idx < Math.min(myHighPriorityIssues.length, 5) - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper
                sx={{
                  p: 2.5,
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
                  border: '1px solid rgba(148,163,184,0.2)',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                  <NotificationsIcon fontSize="small" sx={{ color: '#475569' }} />
                  <Typography
                    variant="h6"
                    sx={{
                      pl: 1.2,
                      borderLeft: '4px solid #475569',
                      lineHeight: 1.1,
                    }}
                  >
                    {t('dashboard.sections.recentActivity')}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ lineHeight: 1.1, fontWeight: 600, color: '#334155' }}>
                    ({recentActivity.length})
                  </Typography>
                </Stack>
                {recentActivity.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {t('dashboard.empty.noActivity')}
                  </Typography>
                ) : (
                  <List disablePadding>
                    {recentActivity.map((item, idx) => (
                      <Box key={item.id}>
                        <ListItemButton
                          onClick={() => {
                            if (item.issueId && item.issue?.projectId) {
                              navigate(
                                `/projects/${item.issue.projectId}/issues/${item.issueId}`,
                              );
                            }
                          }}
                          sx={{
                            px: 1,
                            borderRadius: 1.5,
                            '&:hover': { bgcolor: 'rgba(71,85,105,0.08)' },
                          }}
                        >
                          <ListItemText
                            primary={item.title}
                            secondary={item.message || formatDate(item.createdAt)}
                          />
                          {(item.issueId && item.issue?.projectId) && (
                            <ArrowForwardIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          )}
                          {!item.isRead && (
                            <Chip
                              size="small"
                              label={t('dashboard.unread')}
                              color="primary"
                              variant="outlined"
                            />
                          )}
                        </ListItemButton>
                        {idx < recentActivity.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 2.5,
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
                  border: '1px solid rgba(148,163,184,0.2)',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                  <FolderIcon fontSize="small" sx={{ color: '#1d4ed8' }} />
                  <Typography
                    variant="h6"
                    sx={{
                      pl: 1.2,
                      borderLeft: '4px solid #1d4ed8',
                      lineHeight: 1.1,
                    }}
                  >
                    {t('dashboard.sections.myProjects')}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ lineHeight: 1.1, fontWeight: 600, color: '#334155' }}>
                    ({projectSnapshots.length})
                  </Typography>
                </Stack>
                {projectSnapshots.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {t('dashboard.empty.noProjects')}
                  </Typography>
                ) : (
                  <List disablePadding>
                    {projectSnapshots.map((project, idx) => (
                      <Box key={project.id}>
                        <ListItemButton
                          onClick={() => navigate(`/projects/${project.id}`)}
                          sx={{
                            px: 1,
                            borderRadius: 1.5,
                            '&:hover': { bgcolor: 'rgba(29,78,216,0.06)' },
                          }}
                        >
                          <ListItemText
                            primary={`${project.name} (${project.key})`}
                            secondary={t('dashboard.projectIssueCount', {
                              count: project.issueCount,
                            })}
                          />
                        </ListItemButton>
                        {idx < projectSnapshots.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="flex-start"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={1}
            sx={{
              mb: 1.5,
              mt: 0.5,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              bgcolor: '#ffffff',
              border: '1px solid rgba(148,163,184,0.28)',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#334155', fontWeight: 600 }}>
              {t('dashboard.charts.appliesToBoth')}
            </Typography>
            <FormControl
              size="small"
              sx={{
                minWidth: 170,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#ffffff',
                },
              }}
            >
              <Select
                value={chartRange}
                onChange={(e) => setChartRange(e.target.value as ChartRange)}
              >
                <MenuItem value="all">{t('projectDetail.insights.rangeAll')}</MenuItem>
                <MenuItem value="6m">{t('projectDetail.insights.range6m')}</MenuItem>
                <MenuItem value="3m">{t('projectDetail.insights.range3m')}</MenuItem>
                <MenuItem value="1m">{t('projectDetail.insights.range1m')}</MenuItem>
                <MenuItem value="14d">{t('projectDetail.insights.range14d')}</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
                  border: '1px solid rgba(148,163,184,0.2)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1.5,
                    pl: 1.2,
                    borderLeft: '4px solid #1d4ed8',
                    lineHeight: 1.1,
                  }}
                >
                  {`${t('dashboard.sections.statusOverview')} (${chartRangeLabel})`}
                </Typography>
                <Box sx={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell
                            key={entry.key}
                            fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number | string) => [
                          value,
                          t('projectDetail.insights.tooltipCount'),
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
                  border: '1px solid rgba(148,163,184,0.2)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1.5,
                    pl: 1.2,
                    borderLeft: '4px solid #15803d',
                    lineHeight: 1.1,
                  }}
                >
                  {`${t('dashboard.sections.trend14d')} (${chartRangeLabel})`}
                </Typography>
                <Box sx={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis allowDecimals={false} />
                      <Tooltip
                        formatter={(value: number | string) => [
                          value,
                          t('projectDetail.insights.tooltipValue'),
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#1d4ed8"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Dashboard;


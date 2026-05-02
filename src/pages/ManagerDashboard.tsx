import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  Block as BlockIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAuth } from '../shared/auth/src';
import { Page401 } from '../shared/ui/exception/Page401';
import projectsApi from '../features/projects/src/store/api';
import issuesApi from '../features/issues/src/store/api';
import type { Issue } from '../features/issues/src/store/states';
import type { Project } from '../features/projects/src/store/states';
import { isPastDueDate } from '../shared/utils/src';

type ChartRange = 'all' | '6m' | '3m' | '1m' | '14d';
type ProjectBucket = {
  project: Project;
  openIssues: Issue[];
  blocked: number;
  highRisk: number;
  unassigned: number;
};

const STATUS_COLORS = ['#475569', '#1d4ed8', '#15803d'];
const HIGH_PRIORITY = ['highest', 'high'];
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
  blocked: {
    bg: 'rgba(148,163,184,0.2)',
    iconBg: 'rgba(148,163,184,0.34)',
    iconColor: '#475569',
    border: 'rgba(148,163,184,0.44)',
  },
} as const;

const ManagerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { checkRole } = useAuth();
  const navigate = useNavigate();
  const canAccess = checkRole(['admin', 'manager']);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [chartRange, setChartRange] = useState<ChartRange>('14d');

  useEffect(() => {
    if (!canAccess) return;
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const projectsRes = await projectsApi.getProjects({ scope: 'managed' });
        const loadedProjects = projectsRes.data ?? [];
        const issueResponses = await Promise.all(
          loadedProjects.map((project) => issuesApi.getIssues({ projectId: project.id })),
        );
        const loadedIssues = issueResponses.flatMap((res) => res.data ?? []);
        if (!mounted) return;
        setProjects(loadedProjects);
        setIssues(loadedIssues);
      } catch (err) {
        if (!mounted) return;
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void loadData();
    return () => {
      mounted = false;
    };
  }, [canAccess]);

  const filteredChartIssues = useMemo(() => {
    if (chartRange === 'all') return issues;
    const now = new Date();
    const from = new Date(now);
    if (chartRange === '14d') from.setDate(now.getDate() - 14);
    else if (chartRange === '1m') from.setMonth(now.getMonth() - 1);
    else if (chartRange === '3m') from.setMonth(now.getMonth() - 3);
    else if (chartRange === '6m') from.setMonth(now.getMonth() - 6);
    return issues.filter((issue) => {
      const createdAt = new Date(issue.createdAt);
      if (Number.isNaN(createdAt.getTime())) return false;
      return createdAt >= from;
    });
  }, [chartRange, issues]);

  const openIssues = useMemo(
    () => filteredChartIssues.filter((issue) => (issue.status?.category ?? '').toLowerCase() !== 'done'),
    [filteredChartIssues],
  );

  const highRiskIssues = useMemo(
    () => openIssues.filter((issue) => HIGH_PRIORITY.includes((issue.priority?.name ?? '').toLowerCase())),
    [openIssues],
  );
  const blockedIssues = useMemo(
    () => openIssues.filter((issue) => (issue.status?.name ?? '').toLowerCase().includes('block')),
    [openIssues],
  );
  const unassignedIssues = useMemo(
    () => openIssues.filter((issue) => !issue.assigneeId),
    [openIssues],
  );

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
      { key: 'inprogress', name: t('dashboard.charts.statusInProgress'), value: buckets.inprogress },
      { key: 'done', name: t('dashboard.charts.statusDone'), value: buckets.done },
    ];
  }, [filteredChartIssues, t]);

  const trendChartData = useMemo(() => {
    const now = new Date();
    const byDay = chartRange === '14d' || chartRange === '1m';
    const bucketCount =
      chartRange === '14d' ? 14 : chartRange === '1m' ? 30 : chartRange === '3m' ? 13 : chartRange === '6m' ? 6 : 12;
    const buckets = new Map<string, number>();
    const labels: string[] = [];
    for (let i = bucketCount - 1; i >= 0; i -= 1) {
      const point = new Date(now);
      if (byDay) point.setDate(now.getDate() - i);
      else point.setMonth(now.getMonth() - i);
      const key = byDay
        ? point.toISOString().slice(0, 10)
        : `${point.getFullYear()}-${point.getMonth() + 1}`;
      if (!buckets.has(key)) labels.push(key);
      buckets.set(key, 0);
    }
    filteredChartIssues.forEach((issue) => {
      const created = new Date(issue.createdAt);
      if (Number.isNaN(created.getTime())) return;
      const key = byDay
        ? created.toISOString().slice(0, 10)
        : `${created.getFullYear()}-${created.getMonth() + 1}`;
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
    });
    return labels.map((key) => ({
      label: byDay ? key.slice(5) : key,
      value: buckets.get(key) ?? 0,
    }));
  }, [chartRange, filteredChartIssues]);

  const projectBuckets = useMemo<ProjectBucket[]>(() => {
    const byProject = new Map<string, Issue[]>();
    for (const issue of filteredChartIssues) {
      const current = byProject.get(issue.projectId) ?? [];
      current.push(issue);
      byProject.set(issue.projectId, current);
    }
    return projects
      .map((project) => {
        const projectIssues = byProject.get(project.id) ?? [];
        const openProjectIssues = projectIssues.filter(
          (issue) => (issue.status?.category ?? '').toLowerCase() !== 'done',
        );
        return {
          project,
          openIssues: openProjectIssues.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          ),
          blocked: openProjectIssues.filter((issue) =>
            (issue.status?.name ?? '').toLowerCase().includes('block'),
          ).length,
          highRisk: openProjectIssues.filter((issue) =>
            HIGH_PRIORITY.includes((issue.priority?.name ?? '').toLowerCase()),
          ).length,
          unassigned: openProjectIssues.filter((issue) => !issue.assigneeId).length,
        };
      })
      .sort(
        (a, b) =>
          b.blocked * 3 + b.highRisk * 2 + b.unassigned - (a.blocked * 3 + a.highRisk * 2 + a.unassigned),
      );
  }, [filteredChartIssues, projects]);

  const formatDate = (value?: string) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return `${String(date.getDate()).padStart(2, '0')}/${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const isIssueOverdue = (issue: Issue) =>
    isPastDueDate(issue.dueDate, issue.status?.category, issue.status?.name);

  if (!canAccess) return <Page401 />;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {t('managerDashboard.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('managerDashboard.subtitle')}
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
          {t('managerDashboard.loadFailed')}: {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          {projects.length === 0 ? (
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
                border: '1px solid rgba(148,163,184,0.2)',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                {t('managerDashboard.empty.noProjects')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('managerDashboard.empty.noProjectsHint')}
              </Typography>
            </Paper>
          ) : (
            <>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {[
                  {
                    label: t('managerDashboard.kpi.totalOpen'),
                    value: openIssues.length,
                    icon: <AssignmentIcon fontSize="small" />,
                    style: KPI_STYLE.open,
                  },
                  {
                    label: t('managerDashboard.kpi.highRisk'),
                    value: highRiskIssues.length,
                    icon: <WarningAmberIcon fontSize="small" />,
                    style: KPI_STYLE.attention,
                  },
                  {
                    label: t('managerDashboard.kpi.unassigned'),
                    value: unassignedIssues.length,
                    icon: <CheckCircleIcon fontSize="small" />,
                    style: KPI_STYLE.done,
                  },
                  {
                    label: t('managerDashboard.kpi.blocked'),
                    value: blockedIssues.length,
                    icon: <BlockIcon fontSize="small" />,
                    style: KPI_STYLE.blocked,
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
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 14px 28px rgba(15,23,42,0.12)' },
                      }}
                    >
                      <CardContent>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
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

              <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: '0 8px 24px rgba(15,23,42,0.06)', border: '1px solid rgba(148,163,184,0.2)' }}>
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                  {t('managerDashboard.sections.projectRiskRanking')}
                </Typography>
                {projectBuckets.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {t('managerDashboard.empty.noProjects')}
                  </Typography>
                ) : (
                  <Box>
                    {projectBuckets.map((bucket) => (
                      <Accordion key={bucket.project.id} disableGutters sx={{ borderRadius: 1.5, mb: 1, '&:before': { display: 'none' } }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                            <Typography sx={{ fontWeight: 600 }}>
                              {bucket.project.name} ({bucket.project.key})
                            </Typography>
                            <Chip size="small" label={t('managerDashboard.projectPills.open', { count: bucket.openIssues.length })} />
                            <Chip size="small" color="error" label={t('managerDashboard.projectPills.high', { count: bucket.highRisk })} />
                            <Chip size="small" color="warning" label={t('managerDashboard.projectPills.blocked', { count: bucket.blocked })} />
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                          {bucket.openIssues.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              {t('managerDashboard.empty.noOpenIssues')}
                            </Typography>
                          ) : (
                            <List disablePadding>
                              {bucket.openIssues.slice(0, 12).map((issue, idx) => (
                                <Box key={issue.id}>
                                  <ListItemButton onClick={() => navigate(`/projects/${issue.projectId}/issues/${issue.id}`)}>
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
                                      secondary={`${issue.priority?.name ?? '-'} • ${issue.status?.name ?? '-'} • ${t('managerDashboard.dueDateLabel')}: ${issue.dueDate ? formatDate(issue.dueDate) : t('managerDashboard.noDueDate')} • ${issue.assignee?.displayName ?? t('projectDetail.unassigned')}`}
                                    />
                                  </ListItemButton>
                                  {idx < Math.min(bucket.openIssues.length, 12) - 1 && <Divider />}
                                </Box>
                              ))}
                            </List>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                )}
              </Paper>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="flex-start"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={1}
                sx={{ mb: 1.5, mt: 2, px: 1.5, py: 1, borderRadius: 2, bgcolor: '#fff', border: '1px solid rgba(148,163,184,0.28)' }}
              >
                <Typography variant="subtitle2" sx={{ color: '#334155', fontWeight: 600 }}>
                  {t('dashboard.charts.appliesToBoth')}
                </Typography>
                <FormControl size="small" sx={{ minWidth: 170 }}>
                  <Select value={chartRange} onChange={(e) => setChartRange(e.target.value as ChartRange)}>
                    <MenuItem value="all">{t('projectDetail.insights.rangeAll')}</MenuItem>
                    <MenuItem value="6m">{t('projectDetail.insights.range6m')}</MenuItem>
                    <MenuItem value="3m">{t('projectDetail.insights.range3m')}</MenuItem>
                    <MenuItem value="1m">{t('projectDetail.insights.range1m')}</MenuItem>
                    <MenuItem value="14d">{t('projectDetail.insights.range14d')}</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: '0 8px 24px rgba(15,23,42,0.06)', border: '1px solid rgba(148,163,184,0.2)' }}>
                    <Typography variant="h6" sx={{ mb: 1.5, pl: 1.2, borderLeft: '4px solid #1d4ed8', lineHeight: 1.1 }}>
                      {t('managerDashboard.sections.statusOverview')}
                    </Typography>
                    <Box sx={{ height: 280 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={statusChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                            {statusChartData.map((entry, index) => (
                              <Cell key={entry.key} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: '0 8px 24px rgba(15,23,42,0.06)', border: '1px solid rgba(148,163,184,0.2)' }}>
                    <Typography variant="h6" sx={{ mb: 1.5, pl: 1.2, borderLeft: '4px solid #15803d', lineHeight: 1.1 }}>
                      {t('managerDashboard.sections.trend')}
                    </Typography>
                    <Box sx={{ height: 280 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#1d4ed8" strokeWidth={2.5} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default ManagerDashboard;

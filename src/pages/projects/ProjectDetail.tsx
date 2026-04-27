import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Container,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { CreateIssueModal, EditIssueModal, DeleteIssueDialog } from '../../features/issues/src';
import { useSelectorReferenceData } from '../../features/reference-data/src/store';
import type { Issue } from '../../features/issues/src/store/states';
import { BoardView, CreateBoardModal, EditBoardModal, DeleteBoardDialog } from '../../features/boards/src';
import type { Board, BoardColumn } from '../../features/boards/src/store/states';
import {
  SprintList,
  CreateSprintModal,
  EditSprintModal,
  DeleteSprintDialog,
  SprintIssuesView,
} from '../../features/sprints/src';
import { sprintsActions, useSelectorSprints } from '../../features/sprints/src/store';
import type { Sprint } from '../../features/sprints/src/store/states';
import { projectsActions, useSelectorProjects } from '../../features/projects/src/store';
import { boardsActions, useSelectorBoards } from '../../features/boards/src/store';
import { issuesActions, useSelectorIssues } from '../../features/issues/src/store';
import {
  TeamList,
  AssignRoleModal,
} from '../../features/team/src';
import { teamActions, useSelectorTeam } from '../../features/team/src/store';
import { usersActions, useSelectorUsers } from '../../features/users/src/store';
import type { ProjectTeamMember } from '../../features/team/src/store/states';
import {
  ActivityFeed,
  ActivityFilter,
} from '../../features/activity/src';
import type { EntityTypeFilter } from '../../features/activity/src/components/ActivityFilter';
import { useSelectorAuth } from '../../features/auth/src/store';
import { UI_COLORS, UI_TYPOGRAPHY, UI_BORDER_RADIUS, UI_SHADOWS, UI_BUTTON_STYLES } from '../../shared/constants/src/ui';

type InsightsTimeRange = 'all' | '6m' | '3m' | '1m' | '14d';

const PRIORITY_COLOR_MAP = {
  highest: '#991B1B',
  high: '#DC2626',
  medium: '#D97706',
  low: '#16A34A',
} as const;

const STATUS_COLOR_MAP = {
  todo: { bg: '#DCE4EC', text: '#334155', border: '#BFCBDA' },
  inprogress: { bg: '#DCEAFF', text: '#1D4ED8', border: '#B6CCF8' },
  done: { bg: '#D3EEDB', text: '#166534', border: '#A7D7B5' },
} as const;

const ProjectDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelectorAuth((state) => state);
  const currentUser = authState.user;
  const sprintsState = useSelectorSprints((state) => state);
  const boardsState = useSelectorBoards((state) => state);
  const issuesState = useSelectorIssues((state) => state);
  const referenceDataState = useSelectorReferenceData((state) => state);
  const teamState = useSelectorTeam((state) => state);
  const usersState = useSelectorUsers((state) => state);

  // All project issues (for Issues tab)
  const allProjectIssues = issuesState.issues.filter((issue) => issue.projectId === projectId);
  const [issueSortBy, setIssueSortBy] = useState<'createdAt' | 'updatedAt' | 'assignee'>('updatedAt');
  const [issueSortOrder, setIssueSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedProjectIssues = React.useMemo(() => {
    const issues = [...allProjectIssues];
    issues.sort((a, b) => {
      if (issueSortBy === 'createdAt' || issueSortBy === 'updatedAt') {
        const timeA = a[issueSortBy] ? new Date(a[issueSortBy]).getTime() : 0;
        const timeB = b[issueSortBy] ? new Date(b[issueSortBy]).getTime() : 0;
        return issueSortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }

      const nameA = (a.assignee?.displayName || '').toLowerCase();
      const nameB = (b.assignee?.displayName || '').toLowerCase();
      if (nameA < nameB) return issueSortOrder === 'asc' ? -1 : 1;
      if (nameA > nameB) return issueSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return issues;
  }, [allProjectIssues, issueSortBy, issueSortOrder]);
  const [insightsTimeRange, setInsightsTimeRange] = useState<InsightsTimeRange>('14d');

  const filteredInsightsIssues = React.useMemo(() => {
    if (insightsTimeRange === 'all') return allProjectIssues;

    const now = new Date();
    const from = new Date(now);
    if (insightsTimeRange === '14d') from.setDate(now.getDate() - 14);
    else if (insightsTimeRange === '1m') from.setMonth(now.getMonth() - 1);
    else if (insightsTimeRange === '3m') from.setMonth(now.getMonth() - 3);
    else if (insightsTimeRange === '6m') from.setMonth(now.getMonth() - 6);

    return allProjectIssues.filter((issue) => {
      if (!issue.createdAt) return false;
      const createdAt = new Date(issue.createdAt);
      return createdAt >= from && createdAt <= now;
    });
  }, [allProjectIssues, insightsTimeRange]);

  const statusInsights = React.useMemo(() => {
    const statusById = new Map(referenceDataState.statuses.map((s) => [s.id, s]));
    const base = {
      todo: 0,
      inprogress: 0,
      done: 0,
    };
    for (const issue of filteredInsightsIssues) {
      const status = statusById.get(issue.statusId || '');
      const cat = status?.category?.toLowerCase();
      if (cat === 'todo' || cat === 'inprogress' || cat === 'done') {
        base[cat] += 1;
      } else {
        base.todo += 1;
      }
    }

    const total = filteredInsightsIssues.length;
    const completionRate = total > 0 ? Math.round((base.done / total) * 100) : 0;
    return {
      chart: [
        { key: 'todo', label: t('projectDetail.insights.statusTodo'), value: base.todo, color: '#475569' },
        {
          key: 'inprogress',
          label: t('projectDetail.insights.statusInProgress'),
          value: base.inprogress,
          color: '#1d4ed8',
        },
        { key: 'done', label: t('projectDetail.insights.statusDone'), value: base.done, color: '#15803d' },
      ],
      total,
      done: base.done,
      completionRate,
    };
  }, [filteredInsightsIssues, referenceDataState.statuses, t]);

  const priorityInsights = React.useMemo(() => {
    const priorityById = new Map(referenceDataState.priorities.map((p) => [p.id, p]));
    const groups = [
      { key: 'highest', label: t('projectDetail.insights.priorityHighest'), value: 0, color: '#991b1b' },
      { key: 'high', label: t('projectDetail.insights.priorityHigh'), value: 0, color: '#dc2626' },
      { key: 'medium', label: t('projectDetail.insights.priorityMedium'), value: 0, color: '#d97706' },
      { key: 'low', label: t('projectDetail.insights.priorityLow'), value: 0, color: '#16a34a' },
    ];
    const indexByKey = new Map(groups.map((g, i) => [g.key, i]));

    for (const issue of filteredInsightsIssues) {
      const priority = priorityById.get(issue.priorityId || '');
      const name = (priority?.name || '').toLowerCase();
      let key: string = 'medium';
      if (name.includes('highest')) key = 'highest';
      else if (name.includes('high')) key = 'high';
      else if (name.includes('low')) key = 'low';
      else if (name.includes('medium')) key = 'medium';

      const idx = indexByKey.get(key);
      if (idx !== undefined) groups[idx].value += 1;
    }

    const total = filteredInsightsIssues.length || 1;
    const highRiskCount = groups[0].value + groups[1].value;
    const highRiskShare = Math.round((highRiskCount / total) * 100);

    return { chart: groups, highRiskCount, highRiskShare };
  }, [filteredInsightsIssues, referenceDataState.priorities, t]);

  const trendInsights = React.useMemo(() => {
    const now = new Date();
    const byDay = insightsTimeRange === '14d' || insightsTimeRange === '1m';
    const bucketCount = insightsTimeRange === '14d' ? 14 : insightsTimeRange === '1m' ? 30 : insightsTimeRange === '3m' ? 13 : insightsTimeRange === '6m' ? 6 : 12;
    const keys: string[] = [];
    for (let i = bucketCount - 1; i >= 0; i -= 1) {
      const d = new Date(now);
      if (byDay) d.setDate(now.getDate() - i);
      else d.setMonth(now.getMonth() - i);
      keys.push(byDay ? d.toISOString().slice(0, 10) : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }

    const counts = new Map(keys.map((k) => [k, 0]));
    for (const issue of filteredInsightsIssues) {
      if (!issue.createdAt) continue;
      const created = new Date(issue.createdAt);
      const key = byDay
        ? created.toISOString().slice(0, 10)
        : `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`;
      if (counts.has(key)) counts.set(key, (counts.get(key) || 0) + 1);
    }

    const chart = keys.map((k) => {
      const [year, month, day] = k.split('-');
      const label = byDay ? `${day}/${month}` : `${month}/${year.slice(2)}`;
      return { dateKey: k, label, count: counts.get(k) || 0 };
    });
    const totalCreated = chart.reduce((sum, d) => sum + d.count, 0);
    const avgPerDay = Number((totalCreated / Math.max(chart.length, 1)).toFixed(1));
    return { chart, totalCreated, avgPerDay };
  }, [filteredInsightsIssues, insightsTimeRange]);

  const insightsRangeLabel = React.useMemo(() => {
    if (insightsTimeRange === 'all') return t('projectDetail.insights.rangeAll');
    if (insightsTimeRange === '6m') return t('projectDetail.insights.range6m');
    if (insightsTimeRange === '3m') return t('projectDetail.insights.range3m');
    if (insightsTimeRange === '1m') return t('projectDetail.insights.range1m');
    return t('projectDetail.insights.range14d');
  }, [insightsTimeRange, t]);

  const formatInsightsTooltip = React.useCallback(
    (
      value: string | number | ReadonlyArray<string | number> | undefined,
      name: string | number | undefined
    ): [string | number, string] => {
      const safeName = typeof name === 'string' ? name : String(name ?? '');
      const safeValue =
        typeof value === 'number' || typeof value === 'string'
          ? value
          : Array.isArray(value)
          ? value.join(', ')
          : '';

      if (safeName === 'count') {
        return [safeValue, t('projectDetail.insights.tooltipCount')];
      }
      if (safeName === 'value') {
        return [safeValue, t('projectDetail.insights.tooltipValue')];
      }
      return [safeValue, safeName];
    },
    [t]
  );

  // Generate board columns dynamically from statuses
  const boardColumns: BoardColumn[] = React.useMemo(() => {
    const statuses = referenceDataState.statuses;
    if (statuses.length === 0) return [];

    // Group statuses by category
    const todoStatuses = statuses.filter((s) => s.category === 'todo');
    const inProgressStatuses = statuses.filter((s) => s.category === 'inprogress');
    const doneStatuses = statuses.filter((s) => s.category === 'done');

    const columns: BoardColumn[] = [];

    if (todoStatuses.length > 0) {
      columns.push({
        id: 'todo',
        name: t('projectDetail.columnTodo'),
        statusIds: todoStatuses.map((s) => s.id),
        color: '#475569',
      });
    }

    if (inProgressStatuses.length > 0) {
      columns.push({
        id: 'inprogress',
        name: t('projectDetail.columnInProgress'),
        statusIds: inProgressStatuses.map((s) => s.id),
        color: '#1D4ED8',
      });
    }

    if (doneStatuses.length > 0) {
      columns.push({
        id: 'done',
        name: t('projectDetail.columnDone'),
        statusIds: doneStatuses.map((s) => s.id),
        color: '#15803D',
      });
    }

    // If no categories match, create columns from all statuses
    if (columns.length === 0 && statuses.length > 0) {
      return statuses.map((status, index) => ({
        id: `column-${index}`,
        name: status.name,
        statusIds: [status.id],
        color: status.color || '#64748B',
      }));
    }

    return columns;
  }, [referenceDataState.statuses, t]);

  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Sprints state - using Redux
  const [createSprintModalOpen, setCreateSprintModalOpen] = useState(false);
  const [editSprintModalOpen, setEditSprintModalOpen] = useState(false);
  const [deleteSprintDialogOpen, setDeleteSprintDialogOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
  const [viewSprintIssues, setViewSprintIssues] = useState<Sprint | null>(null);
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);

  // Filter sprints by current board to ensure we only use sprints for the selected board
  const sprints = React.useMemo(() => {
    if (!currentBoardId) return sprintsState.sprints;
    return sprintsState.sprints.filter((sprint) => sprint.boardId === currentBoardId);
  }, [sprintsState.sprints, currentBoardId]);
  const [createBoardModalOpen, setCreateBoardModalOpen] = useState(false);
  const [editBoardModalOpen, setEditBoardModalOpen] = useState(false);
  const [deleteBoardDialogOpen, setDeleteBoardDialogOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  // Board-specific issues (for Board View)
  // Show issues that belong to sprints in the current board, OR unassigned issues (backlog)
  // Unassigned issues show on all boards as they can be added to any sprint
  const boardIssues = React.useMemo(() => {
    // If no board is selected, show all project issues (including unassigned)
    if (!currentBoardId) {
      return allProjectIssues;
    }

    // Get sprint IDs for the current board
    const boardSprintIds = sprints
      .filter((sprint) => sprint.boardId === currentBoardId)
      .map((sprint) => sprint.id);

    // Show issues that:
    // 1. Belong to sprints in the current board, OR
    // 2. Are unassigned (no sprintId) - these are backlog issues available to all boards
    const filtered = allProjectIssues.filter(
      (issue) => !issue.sprintId || boardSprintIds.includes(issue.sprintId)
    );

    return filtered;
  }, [allProjectIssues, currentBoardId, sprints]);

  // Team state
  const [assignRoleModalOpen, setAssignRoleModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<ProjectTeamMember | null>(null);
  const [removeTeamMemberDialogOpen, setRemoveTeamMemberDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<ProjectTeamMember | null>(null);

  // Get team members from Redux state
  const teamMembers = teamState.teamMembers;

  // Activity state
  const [activityFilter, setActivityFilter] = useState<EntityTypeFilter>('all');

  // Fetch issues for the project using Redux
  useEffect(() => {
    if (!projectId) return;

    dispatch(
      issuesActions.getIssuesRequest({
        data: { projectId },
        callback: {
          onSuccess: () => {
            // Issues loaded successfully
          },
          onError: (error: any) => {
            console.error('Failed to fetch issues:', error);
          },
        },
      } as any)
    );
  }, [projectId, dispatch]);

  // Fetch boards for the project using Redux
  useEffect(() => {
    if (!projectId) return;

    dispatch(
      boardsActions.getBoardsByProjectRequest({
        data: { projectId },
        callback: {
          onSuccess: (boards: any[]) => {
            if (boards && boards.length > 0) {
              // Use the first board's UUID
              setCurrentBoardId(boards[0].id);
            } else {
              // No boards found for this project
              setCurrentBoardId(null);
            }
          },
          onError: (error: any) => {
            console.error('Failed to fetch boards:', error);
            setCurrentBoardId(null);
          },
        },
      } as any)
    );
  }, [projectId, dispatch]);

  // Load sprints for the current board
  useEffect(() => {
    if (currentBoardId) {
      dispatch(
        sprintsActions.getSprintsByBoardRequest({
          data: { boardId: currentBoardId },
          callback: {
            onSuccess: () => {
              // Sprints loaded successfully
            },
            onError: (error: any) => {
              console.error('Failed to load sprints:', error);
            },
          },
        } as any)
      );
    }
  }, [currentBoardId, dispatch]);

  // Fetch roles on mount
  useEffect(() => {
    dispatch(
      teamActions.getRolesRequest({
        callback: {
          onSuccess: () => {
            // Roles loaded successfully
          },
          onError: (error: any) => {
            console.error('Failed to fetch roles:', error);
          },
        },
      } as any)
    );
  }, [dispatch]);

  // Fetch users on mount
  useEffect(() => {
    dispatch(
      usersActions.getUsersRequest({
        callback: {
          onSuccess: () => {
            // Users loaded successfully
          },
          onError: (error: any) => {
            console.error('Failed to fetch users:', error);
          },
        },
      } as any)
    );
  }, [dispatch]);

  // Fetch team members for the project
  useEffect(() => {
    if (projectId) {
      dispatch(
        teamActions.getTeamMembersRequest({
          data: { projectId },
          callback: {
            onSuccess: () => {
              // Team members loaded successfully
            },
            onError: (error: any) => {
              console.error('Failed to fetch team members:', error);
            },
          },
        } as any)
      );
    }
  }, [projectId, dispatch]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleIssueSort = (sortBy: 'createdAt' | 'updatedAt' | 'assignee') => {
    if (issueSortBy === sortBy) {
      setIssueSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setIssueSortBy(sortBy);
    setIssueSortOrder('asc');
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

  const getPriorityChipColor = (priority?: { name?: string; color?: string }) => {
    const name = (priority?.name || '').toLowerCase();
    if (name.includes('highest')) return PRIORITY_COLOR_MAP.highest;
    if (name.includes('high')) return PRIORITY_COLOR_MAP.high;
    if (name.includes('low')) return PRIORITY_COLOR_MAP.low;
    if (name.includes('medium')) return PRIORITY_COLOR_MAP.medium;
    return priority?.color || '#64748B';
  };

  const getStatusChipStyle = (status?: { category?: string; name?: string; color?: string }) => {
    const category = (status?.category || '').toLowerCase();
    if (category === 'todo') return STATUS_COLOR_MAP.todo;
    if (category === 'inprogress') return STATUS_COLOR_MAP.inprogress;
    if (category === 'done') return STATUS_COLOR_MAP.done;

    const name = (status?.name || '').toLowerCase();
    if (name.includes('to do') || name.includes('todo')) return STATUS_COLOR_MAP.todo;
    if (name.includes('progress')) return STATUS_COLOR_MAP.inprogress;
    if (name.includes('done')) return STATUS_COLOR_MAP.done;
    return { bg: status?.color || '#DCE4EC', text: '#334155', border: '#BFCBDA' };
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, issue: Issue) => {
    setSelectedIssue(issue);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleView = () => {
    handleMenuClose();
    if (selectedIssue && projectId) {
      navigate(`/projects/${projectId}/issues/${selectedIssue.id}`);
    }
  };

  const handleEdit = () => {
    handleMenuClose();
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleCreateIssue = () => {
    setCreateModalOpen(true);
  };

  const handleIssueCreated = (newIssue: Issue) => {
    // Issue is already added to Redux state by the saga
    // Optionally reload issues to ensure consistency
    if (projectId) {
      dispatch(
        issuesActions.getIssuesRequest({
          data: { projectId },
          callback: {},
        } as any)
      );
    }
  };

  const handleIssueUpdated = (updatedIssue: Issue) => {
    // Issue is already updated in Redux state by the saga
    // Optionally reload issues to ensure consistency
    if (projectId) {
      dispatch(
        issuesActions.getIssuesRequest({
          data: { projectId },
          callback: {},
        } as any)
      );
    }
  };

  const handleIssueDeleted = (issueId: string) => {
    // Issue is already removed from Redux state by the saga
    // Optionally reload issues to ensure consistency
    if (projectId) {
      dispatch(
        issuesActions.getIssuesRequest({
          data: { projectId },
          callback: {},
        } as any)
      );
    }
  };

  const handleIssueMove = (issueId: string, newStatusId: string) => {
    // Update issue status when moved on board using transition API
    dispatch(
      issuesActions.transitionIssueRequest({
        data: {
          id: issueId,
          statusId: newStatusId,
        },
        callback: {
          onSuccess: () => {
            // Issue status updated successfully
            // Reload issues to get updated data
            if (projectId) {
              dispatch(
                issuesActions.getIssuesRequest({
                  data: { projectId },
                  callback: {},
                } as any)
              );
            }
          },
          onError: (error: any) => {
            console.error('Failed to transition issue:', error);
          },
        },
      } as any)
    );
  };

  // Sprint handlers
  const handleSprintCreated = () => {
    // Sprint is already added to Redux state by the saga
    // Optionally reload sprints to ensure consistency
    if (currentBoardId) {
      dispatch(
        sprintsActions.getSprintsByBoardRequest({
          data: { boardId: currentBoardId },
          callback: {},
        } as any)
      );
    }
  };

  const handleSprintUpdated = () => {
    // Sprint is already updated in Redux state by the saga
    setSelectedSprint(null);
  };

  const handleSprintDeleted = () => {
    // Sprint is already removed from Redux state by the saga
    setSelectedSprint(null);
  };

  // Board handlers
  const handleBoardCreated = () => {
    // Reload boards to get the new board
    if (projectId) {
      dispatch(
        boardsActions.getBoardsByProjectRequest({
          data: { projectId },
          callback: {
            onSuccess: (boards: any[]) => {
              if (boards && boards.length > 0) {
                // Use the first board's UUID (or the newly created one)
                setCurrentBoardId(boards[0].id);
              }
            },
            onError: (error: any) => {
              console.error('Failed to reload boards:', error);
            },
          },
        } as any)
      );
    }
  };

  const handleBoardUpdated = () => {
    // Board is already updated in Redux state by the saga
    setSelectedBoard(null);
  };

  const handleBoardDeleted = () => {
    // Board is already removed from Redux state by the saga
    setSelectedBoard(null);
    setCurrentBoardId(null);
    // Reload boards to see if there are any remaining
    if (projectId) {
      dispatch(
        boardsActions.getBoardsByProjectRequest({
          data: { projectId },
          callback: {
            onSuccess: (boards: any[]) => {
              if (boards && boards.length > 0) {
                setCurrentBoardId(boards[0].id);
              } else {
                setCurrentBoardId(null);
              }
            },
            onError: (error: any) => {
              console.error('Failed to reload boards:', error);
            },
          },
        } as any)
      );
    }
  };

  const handleStartSprint = (sprint: Sprint) => {
    dispatch(
      sprintsActions.startSprintRequest({
        data: { id: sprint.id },
        callback: {
          onSuccess: () => {
            // Sprint started successfully
          },
          onError: (error: any) => {
            console.error('Failed to start sprint:', error);
          },
        },
      } as any)
    );
  };

  const handleCompleteSprint = (sprint: Sprint) => {
    dispatch(
      sprintsActions.completeSprintRequest({
        data: { id: sprint.id },
        callback: {
          onSuccess: () => {
            // Sprint completed successfully
          },
          onError: (error: any) => {
            console.error('Failed to complete sprint:', error);
          },
        },
      } as any)
    );
  };

  const handleViewSprintIssues = (sprint: Sprint) => {
    setViewSprintIssues(sprint);
  };

  const handleBackFromSprintIssues = () => {
    setViewSprintIssues(null);
  };

  // Team handlers
  const handleRoleAssigned = (userId: string, roleId: string) => {
    // Role assignment is handled by Redux
    // Refetch team members to show the newly added member
    if (projectId) {
      dispatch(
        teamActions.getTeamMembersRequest({
          data: { projectId },
          callback: {
            onSuccess: () => {
              // Team members refreshed
            },
            onError: (error: any) => {
              console.error('Failed to refresh team members:', error);
            },
          },
        } as any)
      );
    }
    setEditingTeamMember(null);
  };

  const handleEditTeamMember = (member: ProjectTeamMember) => {
    setEditingTeamMember(member);
    setAssignRoleModalOpen(true);
  };

  const handleRemoveTeamMember = (member: ProjectTeamMember) => {
    setMemberToRemove(member);
    setRemoveTeamMemberDialogOpen(true);
  };

  const handleConfirmRemoveTeamMember = () => {
    if (!projectId || !memberToRemove) return;

    dispatch(
      teamActions.removeRoleFromUserInProjectRequest({
        data: {
          projectId,
          roleId: memberToRemove.roleId,
          userId: memberToRemove.userId,
        },
        callback: {
          onSuccess: () => {
            // Refetch team members to update the list
            dispatch(
              teamActions.getTeamMembersRequest({
                data: { projectId },
                callback: {
                  onSuccess: () => {
                    // Team members refreshed
                  },
                  onError: (error: any) => {
                    console.error('Failed to refresh team members:', error);
                  },
                },
              } as any)
            );
            setRemoveTeamMemberDialogOpen(false);
            setMemberToRemove(null);
          },
          onError: (error: any) => {
            console.error('Failed to remove team member:', error);
          },
        },
      } as any)
    );
  };

  // Load project data from Redux store
  const projectsState = useSelectorProjects((state) => state);
  const project = projectsState.currentProject || projectsState.projects.find((p) => p.id === projectId) || null;

  useEffect(() => {
    if (projectId) {
      // Fetch project by ID if not already in store or if current project doesn't match
      if (!project || project.id !== projectId) {
        dispatch(
          projectsActions.getProjectByIdRequest({
            data: { id: projectId },
            callback: {
              onError: (error: any) => {
                console.error('Failed to fetch project:', error);
              },
            },
          } as any)
        );
      }
    }
  }, [projectId, dispatch, project]);

  if (!project) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper
          sx={{
            p: 6,
            borderRadius: UI_BORDER_RADIUS.xl,
            boxShadow: UI_SHADOWS.md,
            border: `1px solid ${UI_COLORS.border.light}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 320,
          }}
        >
          <CircularProgress sx={{ color: UI_COLORS.primary.main }} />
        </Paper>
      </Container>
    );
  }

  return (
    <Container key={i18n.language} maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => navigate('/')}
            size="small"
            sx={{
              color: UI_COLORS.text.secondary,
              '&:hover': {
                backgroundColor: UI_COLORS.background.hover,
                color: UI_COLORS.text.primary,
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: UI_BORDER_RADIUS.md,
                  bgcolor: UI_COLORS.primary.main,
                  color: UI_COLORS.primary.contrast,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: UI_TYPOGRAPHY.fontSize.base,
                  fontWeight: UI_TYPOGRAPHY.fontWeight.bold,
                  boxShadow: UI_SHADOWS.sm,
                }}
              >
                {project.key.charAt(0)}
              </Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                  color: UI_COLORS.text.primary,
                  fontSize: { xs: UI_TYPOGRAPHY.fontSize.xl, md: UI_TYPOGRAPHY.fontSize['2xl'] },
                }}
              >
                {project.name}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: UI_COLORS.text.secondary,
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
              }}
            >
              {project.description || t('projectDetail.noDescription')}
            </Typography>
          </Box>
        </Box>
      </Box>


      {/* Tabs */}
      <Paper
        sx={{
          mb: 3,
          borderRadius: UI_BORDER_RADIUS.lg,
          boxShadow: UI_SHADOWS.md,
          border: `1px solid ${UI_COLORS.border.light}`,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
              fontSize: UI_TYPOGRAPHY.fontSize.base,
              minHeight: 48,
              '&.Mui-selected': {
                color: UI_COLORS.primary.main,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: UI_COLORS.primary.main,
            },
          }}
        >
          <Tab label={t('projectDetail.tabBoards')} />
          <Tab label={t('projectDetail.tabIssues')} />
          <Tab label={t('projectDetail.tabInsights')} />
          <Tab label={t('projectDetail.tabTeam')} />
          <Tab label={t('projectDetail.tabActivity')} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          {viewSprintIssues ? (
            <SprintIssuesView
              sprint={viewSprintIssues}
              issues={viewSprintIssues 
                ? allProjectIssues.filter((issue) => issue.sprintId === viewSprintIssues.id)
                : []}
              onBack={handleBackFromSprintIssues}
            />
          ) : (
            <>
              {/* Sprints Section */}
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: UI_BORDER_RADIUS.xl,
                  boxShadow: UI_SHADOWS.md,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                        color: UI_COLORS.text.primary,
                        fontSize: UI_TYPOGRAPHY.fontSize.xl,
                      }}
                    >
                      {t('projectDetail.sprints')}
                    </Typography>
                    {boardsState.boards.length > 1 ? (
                      <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>{t('projectDetail.selectBoard')}</InputLabel>
                        <Select
                          value={currentBoardId || ''}
                          label={t('projectDetail.selectBoard')}
                          onChange={(e) => setCurrentBoardId(e.target.value)}
                        >
                          {boardsState.boards.map((board) => (
                            <MenuItem key={board.id} value={board.id}>
                              {board.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : boardsState.boards.length > 0 && currentBoardId ? (
                      <Chip
                        label={t('projectDetail.boardNamed', {
                          name:
                            boardsState.boards.find((b) => b.id === currentBoardId)?.name ||
                            t('projectDetail.unknown'),
                        })}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ) : null}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {boardsState.boards.length > 0 && currentBoardId && (
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const board = boardsState.boards.find((b) => b.id === currentBoardId);
                            if (board) {
                              setSelectedBoard(board);
                              setEditBoardModalOpen(true);
                            }
                          }}
                          sx={{
                            ...UI_BUTTON_STYLES.secondary,
                            borderRadius: UI_BORDER_RADIUS.md,
                            textTransform: 'none',
                            fontSize: UI_TYPOGRAPHY.fontSize.sm,
                            fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                          }}
                        >
                          {t('projectDetail.editBoard')}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            const board = boardsState.boards.find((b) => b.id === currentBoardId);
                            if (board) {
                              setSelectedBoard(board);
                              setDeleteBoardDialogOpen(true);
                            }
                          }}
                          sx={{
                            borderRadius: UI_BORDER_RADIUS.md,
                            textTransform: 'none',
                            fontSize: UI_TYPOGRAPHY.fontSize.sm,
                            fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                          }}
                        >
                          {t('projectDetail.deleteBoard')}
                        </Button>
                      </>
                    )}
                    {currentBoardId && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateSprintModalOpen(true)}
                        size="small"
                        disabled={boardsState.getBoardsLoading}
                        sx={{
                          ...UI_BUTTON_STYLES.primary,
                          borderRadius: UI_BORDER_RADIUS.md,
                          textTransform: 'none',
                          fontSize: UI_TYPOGRAPHY.fontSize.sm,
                          fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                        }}
                      >
                        {t('projectDetail.createSprint')}
                      </Button>
                    )}
                    {!currentBoardId && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateBoardModalOpen(true)}
                        size="small"
                        sx={{
                          ...UI_BUTTON_STYLES.primary,
                          borderRadius: UI_BORDER_RADIUS.md,
                          textTransform: 'none',
                          fontSize: UI_TYPOGRAPHY.fontSize.sm,
                          fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                        }}
                      >
                        {t('projectDetail.createBoard')}
                      </Button>
                    )}
                  </Box>
                </Box>
                {boardsState.getBoardsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      {t('projectDetail.loadingBoards')}
                    </Typography>
                  </Box>
                ) : !currentBoardId ? (
                  <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      {t('projectDetail.noBoardsAlert')}
                      {projectId && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          {t('projectDetail.projectIdLabel')} {projectId}
                        </Typography>
                      )}
                    </Alert>
                    <SprintList sprints={[]} emptyMessage={t('projectDetail.emptySprintsNoBoard')} />
                  </Box>
                ) : (
                  <SprintList
                    sprints={sprints}
                    onEdit={(sprint) => {
                      setSelectedSprint(sprint);
                      setEditSprintModalOpen(true);
                    }}
                    onDelete={(sprint) => {
                      setSelectedSprint(sprint);
                      setDeleteSprintDialogOpen(true);
                    }}
                    onStart={handleStartSprint}
                    onComplete={handleCompleteSprint}
                    onViewIssues={handleViewSprintIssues}
                  />
                )}
              </Paper>

              {/* Board Section */}
              <Paper
                sx={{
                  p: 3,
                  borderRadius: UI_BORDER_RADIUS.xl,
                  boxShadow: UI_SHADOWS.md,
                  border: `1px solid ${UI_COLORS.border.light}`,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                        color: UI_COLORS.text.primary,
                        fontSize: UI_TYPOGRAPHY.fontSize.xl,
                      }}
                    >
                      {t('projectDetail.boardView')}
                    </Typography>
                    {boardsState.boards.length > 1 ? (
                      <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>{t('projectDetail.selectBoard')}</InputLabel>
                        <Select
                          value={currentBoardId || ''}
                          label={t('projectDetail.selectBoard')}
                          onChange={(e) => setCurrentBoardId(e.target.value)}
                        >
                          {boardsState.boards.map((board) => (
                            <MenuItem key={board.id} value={board.id}>
                              {board.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : boardsState.boards.length > 0 && currentBoardId ? (
                      <Chip
                        label={
                          boardsState.boards.find((b) => b.id === currentBoardId)?.name ||
                          t('projectDetail.unknown')
                        }
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ) : null}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {boardsState.boards.length > 0 && currentBoardId && (
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const board = boardsState.boards.find((b) => b.id === currentBoardId);
                            if (board) {
                              setSelectedBoard(board);
                              setEditBoardModalOpen(true);
                            }
                          }}
                          sx={{
                            ...UI_BUTTON_STYLES.secondary,
                            borderRadius: UI_BORDER_RADIUS.md,
                            textTransform: 'none',
                            fontSize: UI_TYPOGRAPHY.fontSize.sm,
                            fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                          }}
                        >
                          {t('projectDetail.editBoard')}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            const board = boardsState.boards.find((b) => b.id === currentBoardId);
                            if (board) {
                              setSelectedBoard(board);
                              setDeleteBoardDialogOpen(true);
                            }
                          }}
                          sx={{
                            borderRadius: UI_BORDER_RADIUS.md,
                            textTransform: 'none',
                            fontSize: UI_TYPOGRAPHY.fontSize.sm,
                            fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                          }}
                        >
                          {t('projectDetail.deleteBoard')}
                        </Button>
                      </>
                    )}
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleCreateIssue}
                      size="small"
                      disabled={!currentBoardId}
                      sx={{
                        ...UI_BUTTON_STYLES.primary,
                        borderRadius: UI_BORDER_RADIUS.md,
                        textTransform: 'none',
                        fontSize: UI_TYPOGRAPHY.fontSize.sm,
                        fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                      }}
                    >
                      {t('projectDetail.createIssue')}
                    </Button>
                  </Box>
                </Box>
                <BoardView
                  issues={boardIssues}
                  columns={boardColumns}
                  onIssueMove={handleIssueMove}
                />
              </Paper>
            </>
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{t('projectDetail.issuesTitle')}</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateIssue}
              size="small"
              sx={{
                ...UI_BUTTON_STYLES.primary,
                borderRadius: UI_BORDER_RADIUS.md,
                textTransform: 'none',
                fontSize: UI_TYPOGRAPHY.fontSize.sm,
                fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
              }}
            >
              {t('projectDetail.createIssue')}
            </Button>
          </Box>

          {/* Always show table, don't wait for Redux loading */}
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: UI_BORDER_RADIUS.lg,
              boxShadow: UI_SHADOWS.md,
              overflow: 'auto',
              maxHeight: { xs: 460, md: 620 },
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
                      {t('projectDetail.colKey')}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                        color: UI_COLORS.text.primary,
                        fontSize: UI_TYPOGRAPHY.fontSize.sm,
                      }}
                    >
                      {t('projectDetail.colSummary')}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                        color: UI_COLORS.text.primary,
                        fontSize: UI_TYPOGRAPHY.fontSize.sm,
                      }}
                    >
                      {t('projectDetail.colType')}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                        color: UI_COLORS.text.primary,
                        fontSize: UI_TYPOGRAPHY.fontSize.sm,
                      }}
                    >
                      {t('projectDetail.colPriority')}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                        color: UI_COLORS.text.primary,
                        fontSize: UI_TYPOGRAPHY.fontSize.sm,
                      }}
                    >
                      {t('projectDetail.colStatus')}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                        color: UI_COLORS.text.primary,
                        fontSize: UI_TYPOGRAPHY.fontSize.sm,
                      }}
                    >
                      <TableSortLabel
                        active={issueSortBy === 'assignee'}
                        direction={issueSortBy === 'assignee' ? issueSortOrder : 'asc'}
                        onClick={() => handleIssueSort('assignee')}
                      >
                        {t('projectDetail.colAssignee')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                        color: UI_COLORS.text.primary,
                        fontSize: UI_TYPOGRAPHY.fontSize.sm,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <TableSortLabel
                        active={issueSortBy === 'createdAt'}
                        direction={issueSortBy === 'createdAt' ? issueSortOrder : 'asc'}
                        onClick={() => handleIssueSort('createdAt')}
                      >
                        {t('projectDetail.colCreatedAt')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                        color: UI_COLORS.text.primary,
                        fontSize: UI_TYPOGRAPHY.fontSize.sm,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <TableSortLabel
                        active={issueSortBy === 'updatedAt'}
                        direction={issueSortBy === 'updatedAt' ? issueSortOrder : 'asc'}
                        onClick={() => handleIssueSort('updatedAt')}
                      >
                        {t('projectDetail.colUpdatedAt')}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      width={50}
                      sx={{
                        fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                        color: UI_COLORS.text.primary,
                        fontSize: UI_TYPOGRAPHY.fontSize.sm,
                      }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedProjectIssues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('projectDetail.emptyIssues')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedProjectIssues.map((issue) => {
                      const type = issue.type || referenceDataState.issueTypes.find((t) => t.id === issue.typeId);
                      const priority = issue.priority || referenceDataState.priorities.find((p) => p.id === issue.priorityId);
                      const status = issue.status || referenceDataState.statuses.find((s) => s.id === issue.statusId);

                      return (
                        <TableRow
                          key={issue.id}
                          hover
                          sx={{
                            '&:hover': {
                              backgroundColor: UI_COLORS.background.hover,
                            },
                            transition: 'background-color 0.2s ease-in-out',
                          }}
                        >
                          <TableCell>
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
                              onClick={() => navigate(`/projects/${projectId}/issues/${issue.id}`)}
                            >
                              {issue.key}
                            </Typography>
                          </TableCell>
                          <TableCell>{issue.summary}</TableCell>
                          <TableCell>
                            <Chip
                              label={type?.name || t('projectDetail.unknown')}
                              size="small"
                              sx={{
                                bgcolor: type?.color || '#64748B',
                                color: 'white',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={priority?.name || t('projectDetail.unknown')}
                              size="small"
                              sx={{
                                bgcolor: getPriorityChipColor(priority),
                                color: 'white',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={status?.name || t('projectDetail.unknown')}
                              size="small"
                              sx={(() => {
                                const statusStyle = getStatusChipStyle(status);
                                return {
                                  bgcolor: statusStyle.bg,
                                  color: statusStyle.text,
                                  border: `1px solid ${statusStyle.border}`,
                                };
                              })()}
                            />
                          </TableCell>
                          <TableCell>
                            {issue.assignee ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                                  {issue.assignee.displayName.charAt(0)}
                                </Avatar>
                                <Typography variant="body2">{issue.assignee.displayName}</Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                {t('projectDetail.unassigned')}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            {formatDateDDMMYYYY(issue.createdAt)}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            {formatDateDDMMYYYY(issue.updatedAt)}
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, issue)}>
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                            <Menu
                              anchorEl={menuAnchor}
                              open={Boolean(menuAnchor) && selectedIssue?.id === issue.id}
                              onClose={handleMenuClose}
                              PaperProps={{
                                sx: {
                                  borderRadius: UI_BORDER_RADIUS.md,
                                  boxShadow: UI_SHADOWS.lg,
                                  border: `1px solid ${UI_COLORS.border.light}`,
                                  mt: 1,
                                  minWidth: 150,
                                },
                              }}
                            >
                              <MenuItem
                                onClick={handleView}
                                sx={{
                                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                                  '&:hover': { backgroundColor: UI_COLORS.background.hover },
                                }}
                              >
                                {t('home.view')}
                              </MenuItem>
                              <MenuItem
                                onClick={handleEdit}
                                sx={{
                                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                                  '&:hover': { backgroundColor: UI_COLORS.background.hover },
                                }}
                              >
                                <EditIcon sx={{ mr: 1, fontSize: 18 }} />
                                {t('home.edit')}
                              </MenuItem>
                              <MenuItem
                                onClick={handleDelete}
                                sx={{
                                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                                  color: UI_COLORS.error.main,
                                  '&:hover': { backgroundColor: UI_COLORS.error.bg },
                                }}
                              >
                                <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
                                {t('home.delete')}
                              </MenuItem>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: UI_COLORS.text.secondary,
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                }}
              >
                {t('projectDetail.showingIssues', {
                  current: sortedProjectIssues.length,
                  total: allProjectIssues.length,
                })}
              </Typography>
            </Box>
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Paper
            sx={{
              p: 3,
              borderRadius: UI_BORDER_RADIUS.xl,
              boxShadow: UI_SHADOWS.md,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                color: UI_COLORS.text.primary,
                fontSize: UI_TYPOGRAPHY.fontSize.xl,
                mb: 2,
              }}
            >
              {t('projectDetail.insights.title', { range: insightsRangeLabel })}
            </Typography>

            {filteredInsightsIssues.length === 0 ? (
              <Alert severity="info">{t('projectDetail.insights.empty')}</Alert>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel>{t('projectDetail.insights.timeRangeLabel')}</InputLabel>
                    <Select
                      value={insightsTimeRange}
                      label={t('projectDetail.insights.timeRangeLabel')}
                      onChange={(event: SelectChangeEvent) =>
                        setInsightsTimeRange(event.target.value as InsightsTimeRange)
                      }
                    >
                      <MenuItem value="all">{t('projectDetail.insights.rangeAll')}</MenuItem>
                      <MenuItem value="6m">{t('projectDetail.insights.range6m')}</MenuItem>
                      <MenuItem value="3m">{t('projectDetail.insights.range3m')}</MenuItem>
                      <MenuItem value="1m">{t('projectDetail.insights.range1m')}</MenuItem>
                      <MenuItem value="14d">{t('projectDetail.insights.range14d')}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: UI_BORDER_RADIUS.lg,
                      borderColor: 'rgba(37, 99, 235, 0.45)',
                      background: 'linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0.06) 100%)',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t('projectDetail.insights.kpiTotalIssues')}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {statusInsights.total}
                    </Typography>
                  </Paper>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: UI_BORDER_RADIUS.lg,
                      borderColor: 'rgba(22, 163, 74, 0.45)',
                      background: 'linear-gradient(135deg, rgba(22,163,74,0.18) 0%, rgba(22,163,74,0.06) 100%)',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t('projectDetail.insights.kpiCompletionRate')}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {statusInsights.completionRate}%
                    </Typography>
                  </Paper>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: UI_BORDER_RADIUS.lg,
                      borderColor: 'rgba(239, 68, 68, 0.45)',
                      background: 'linear-gradient(135deg, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0.06) 100%)',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {t('projectDetail.insights.kpiHighRiskShare')}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {priorityInsights.highRiskShare}%
                    </Typography>
                  </Paper>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: UI_BORDER_RADIUS.lg, height: 320 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {t('projectDetail.insights.statusTitle')}
                    </Typography>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={statusInsights.chart}
                          dataKey="value"
                          nameKey="label"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                        >
                          {statusInsights.chart.map((entry) => (
                            <Cell key={entry.key} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={formatInsightsTooltip} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Paper>

                  <Paper variant="outlined" sx={{ p: 2, borderRadius: UI_BORDER_RADIUS.lg, height: 320 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {t('projectDetail.insights.priorityTitle')}
                    </Typography>
                    <ResponsiveContainer width="100%" height="90%">
                      <BarChart data={priorityInsights.chart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" interval={0} angle={-15} textAnchor="end" height={60} />
                        <YAxis allowDecimals={false} />
                        <RechartsTooltip formatter={formatInsightsTooltip} />
                        <Bar dataKey="value">
                          {priorityInsights.chart.map((entry) => (
                            <Cell key={entry.key} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Box>

                <Paper variant="outlined" sx={{ p: 2, borderRadius: UI_BORDER_RADIUS.lg, height: 340 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {t('projectDetail.insights.trendTitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('projectDetail.insights.trendSummary', {
                        total: trendInsights.totalCreated,
                        avg: trendInsights.avgPerDay,
                      })}
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height="88%">
                    <LineChart data={trendInsights.chart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis allowDecimals={false} />
                      <RechartsTooltip formatter={formatInsightsTooltip} />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke={UI_COLORS.primary.main}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </>
            )}
          </Paper>
        </Box>
      )}

      {tabValue === 3 && (
        <Box>
          <Paper
            sx={{
              p: 3,
              borderRadius: UI_BORDER_RADIUS.xl,
              boxShadow: UI_SHADOWS.md,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                  color: UI_COLORS.text.primary,
                  fontSize: UI_TYPOGRAPHY.fontSize.xl,
                }}
              >
                {t('projectDetail.teamMembers')}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingTeamMember(null);
                  setAssignRoleModalOpen(true);
                }}
                size="small"
                sx={{
                  ...UI_BUTTON_STYLES.primary,
                  borderRadius: UI_BORDER_RADIUS.md,
                  textTransform: 'none',
                  fontSize: UI_TYPOGRAPHY.fontSize.sm,
                  fontWeight: UI_TYPOGRAPHY.fontWeight.medium,
                }}
              >
                {t('projectDetail.addMember')}
              </Button>
            </Box>
            <TeamList
              teamMembers={teamMembers}
              onEdit={handleEditTeamMember}
              onRemove={handleRemoveTeamMember}
            />
          </Paper>
        </Box>
      )}

      {tabValue === 4 && (
        <Box>
          <Paper
            sx={{
              p: 3,
              borderRadius: UI_BORDER_RADIUS.xl,
              boxShadow: UI_SHADOWS.md,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: UI_TYPOGRAPHY.fontWeight.semibold,
                color: UI_COLORS.text.primary,
                fontSize: UI_TYPOGRAPHY.fontSize.xl,
              }}
            >
              {t('projectDetail.activityTitle')}
            </Typography>
            <ActivityFilter
              entityType={activityFilter}
              onEntityTypeChange={setActivityFilter}
            />
            <ActivityFeed
              auditLogs={[]}
              entityType={activityFilter === 'all' ? undefined : activityFilter}
              entityId={projectId}
              emptyMessage={t('projectDetail.emptyActivity')}
            />
          </Paper>
        </Box>
      )}

      {/* Modals */}
      <CreateIssueModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        projectId={projectId || ''}
        reporterId={currentUser?.id || ''}
        onIssueCreated={handleIssueCreated}
      />
      {selectedIssue && (
        <>
          <EditIssueModal
            open={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedIssue(null);
            }}
            issue={selectedIssue}
            onIssueUpdated={handleIssueUpdated}
          />
          <DeleteIssueDialog
            open={deleteDialogOpen}
            onClose={() => {
              setDeleteDialogOpen(false);
              setSelectedIssue(null);
            }}
            issue={selectedIssue}
            onIssueDeleted={handleIssueDeleted}
          />
        </>
      )}

      {/* Sprint Modals */}
      {currentBoardId && (
        <CreateSprintModal
          open={createSprintModalOpen}
          onClose={() => setCreateSprintModalOpen(false)}
          boardId={currentBoardId}
          onSprintCreated={handleSprintCreated}
        />
      )}
      {selectedSprint && (
        <>
          <EditSprintModal
            open={editSprintModalOpen}
            onClose={() => {
              setEditSprintModalOpen(false);
              setSelectedSprint(null);
            }}
            sprint={selectedSprint}
            onSprintUpdated={handleSprintUpdated}
          />
          <DeleteSprintDialog
            open={deleteSprintDialogOpen}
            onClose={() => {
              setDeleteSprintDialogOpen(false);
              setSelectedSprint(null);
            }}
            sprint={selectedSprint}
            onSprintDeleted={handleSprintDeleted}
          />
        </>
      )}

      {/* Board Modals */}
      {projectId && (
        <CreateBoardModal
          open={createBoardModalOpen}
          onClose={() => setCreateBoardModalOpen(false)}
          projectId={projectId}
          onBoardCreated={handleBoardCreated}
        />
      )}
      {selectedBoard && (
        <>
          <EditBoardModal
            open={editBoardModalOpen}
            onClose={() => {
              setEditBoardModalOpen(false);
              setSelectedBoard(null);
            }}
            board={selectedBoard}
            onBoardUpdated={handleBoardUpdated}
          />
          <DeleteBoardDialog
            open={deleteBoardDialogOpen}
            onClose={() => {
              setDeleteBoardDialogOpen(false);
              setSelectedBoard(null);
            }}
            board={selectedBoard}
            onBoardDeleted={handleBoardDeleted}
          />
        </>
      )}

      {/* Team Modals */}
      <AssignRoleModal
        open={assignRoleModalOpen}
        onClose={() => {
          setAssignRoleModalOpen(false);
          setEditingTeamMember(null);
        }}
        projectId={projectId || ''}
        availableUsers={usersState.users}
        availableRoles={teamState.roles}
        existingTeamMembers={teamMembers}
        editingMember={editingTeamMember}
        onRoleAssigned={handleRoleAssigned}
      />

      {/* Remove Team Member Dialog */}
      <Dialog
        key={i18n.language}
        open={removeTeamMemberDialogOpen}
        onClose={() => setRemoveTeamMemberDialogOpen(false)}
      >
        <DialogTitle>{t('projectDetail.removeMemberTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('projectDetail.removeMemberConfirm', {
              user: memberToRemove?.user.displayName ?? '',
              role: memberToRemove?.role.name ?? '',
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveTeamMemberDialogOpen(false)} disabled={teamState.removeRoleLoading}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirmRemoveTeamMember}
            color="error"
            variant="contained"
            disabled={teamState.removeRoleLoading}
            startIcon={teamState.removeRoleLoading ? <CircularProgress size={16} /> : null}
          >
            {teamState.removeRoleLoading ? t('projectDetail.removing') : t('projectDetail.remove')}
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    );
  };

export default ProjectDetail;

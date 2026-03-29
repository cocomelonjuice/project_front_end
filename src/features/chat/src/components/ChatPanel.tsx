import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  Fab,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AddComment as AddCommentIcon,
  Close as CloseIcon,
  DeleteSweep as DeleteSweepIcon,
  Edit as EditIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Send as SendIcon,
  SmartToy as SmartToyIcon,
} from '@mui/icons-material';
import { keyframes } from '@mui/material/styles';
import { AxiosError } from 'axios';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { chatApi, type ChatConversation, type ChatMessage } from '../api';

const assistantIconPulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.65; transform: scale(1.08); }
`;

function getErrorMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    err.response &&
    typeof err.response === 'object' &&
    'data' in err.response &&
    err.response.data &&
    typeof err.response.data === 'object' &&
    'message' in err.response.data
  ) {
    const m = (err.response.data as { message?: string | string[] }).message;
    if (typeof m === 'string') return m;
    if (Array.isArray(m)) return m.join(', ');
  }
  return fallback;
}

function getChatErrorMessage(
  err: unknown,
  fallback: string,
  t: TFunction,
): string {
  if (err instanceof AxiosError && err.response?.status === 429) {
    return t('chat.rateLimited');
  }
  return getErrorMessage(err, fallback);
}

type ChatErrorKind =
  | 'bootstrap'
  | 'messages'
  | 'send'
  | 'newChat'
  | 'delete'
  | null;

export const ChatPanel: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [listLoading, setListLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorKind, setErrorKind] = useState<ChatErrorKind>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameDraft, setRenameDraft] = useState('');
  const [renameSaving, setRenameSaving] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const scrollToTop = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = 0;
  }, []);

  const handleMessagesScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) setShowScrollTop(el.scrollTop > 72);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const bootstrap = useCallback(async () => {
    if (!token) return;
    setListLoading(true);
    setError(null);
    setErrorKind(null);
    try {
      const { data: list } = await chatApi.listConversations();
      setConversations(list);
      if (list.length === 0) {
        const { data: created } = await chatApi.createConversation({});
        setConversations([created]);
        setSelectedId(created.id);
        setMessages([]);
      } else {
        setSelectedId((prev) => prev ?? list[0].id);
      }
    } catch (err) {
      setError(getChatErrorMessage(err, t('chat.loadFailed'), t));
      setErrorKind('bootstrap');
    } finally {
      setListLoading(false);
    }
  }, [token, t]);

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      if (!token) return;
      setMessagesLoading(true);
      setError(null);
      setErrorKind(null);
      try {
        const { data } = await chatApi.getMessages(conversationId);
        setMessages(data);
      } catch (err) {
        setError(getChatErrorMessage(err, t('chat.loadFailed'), t));
        setErrorKind('messages');
      } finally {
        setMessagesLoading(false);
      }
    },
    [token, t],
  );

  useEffect(() => {
    if (open && token) void bootstrap();
  }, [open, token, bootstrap]);

  useEffect(() => {
    if (!open || !selectedId || !token) return;
    void fetchMessages(selectedId);
  }, [open, selectedId, token, fetchMessages]);

  const handleSelectConversation = (e: SelectChangeEvent<string>) => {
    setSelectedId(e.target.value);
  };

  const handleNewChat = async () => {
    if (!token) return;
    setError(null);
    setErrorKind(null);
    try {
      const { data: created } = await chatApi.createConversation({});
      setConversations((prev) => [created, ...prev]);
      setSelectedId(created.id);
      setMessages([]);
    } catch (err) {
      setError(getChatErrorMessage(err, t('chat.loadFailed'), t));
      setErrorKind('newChat');
    }
  };

  const openRenameDialog = () => {
    const current = conversations.find((x) => x.id === selectedId);
    setRenameDraft(current?.title?.trim() ?? '');
    setRenameOpen(true);
  };

  const handleRenameSave = async () => {
    if (!selectedId || renameSaving) return;
    setRenameSaving(true);
    setError(null);
    setErrorKind(null);
    try {
      const { data } = await chatApi.updateConversation(selectedId, {
        title: renameDraft.trim(),
      });
      setConversations((prev) =>
        prev.map((c) => (c.id === data.id ? { ...c, ...data } : c)),
      );
      setRenameOpen(false);
    } catch (err) {
      setError(getChatErrorMessage(err, t('chat.loadFailed'), t));
    } finally {
      setRenameSaving(false);
    }
  };

  const exitBulkMode = useCallback(() => {
    setBulkMode(false);
    setSelectedForDelete([]);
  }, []);

  const toggleSelectForDelete = (id: string) => {
    setSelectedForDelete((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleBulkDelete = async () => {
    if (selectedForDelete.length === 0 || !token) return;
    if (
      !window.confirm(
        t('chat.confirmDeleteMany', { count: selectedForDelete.length }),
      )
    ) {
      return;
    }
    setDeleting(true);
    setError(null);
    setErrorKind(null);
    try {
      await chatApi.deleteConversations(selectedForDelete);
      const removeIds = new Set(selectedForDelete);
      const nextList = conversations.filter((c) => !removeIds.has(c.id));
      setConversations(nextList);
      setSelectedForDelete([]);
      setBulkMode(false);
      if (selectedId && removeIds.has(selectedId)) {
        if (nextList.length > 0) {
          setSelectedId(nextList[0].id);
        } else {
          const { data: created } = await chatApi.createConversation({});
          setConversations([created]);
          setSelectedId(created.id);
          setMessages([]);
        }
      }
    } catch (err) {
      setError(getChatErrorMessage(err, t('chat.deleteFailed'), t));
      setErrorKind('delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !selectedId || sending) return;
    setSending(true);
    setError(null);
    setErrorKind(null);
    setInput('');
    try {
      const { data } = await chatApi.sendMessage(selectedId, text);
      setMessages((prev) => [...prev, data.userMessage, data.assistantMessage]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? { ...c, updatedAt: new Date().toISOString() }
            : c,
        ),
      );
    } catch (err) {
      setInput(text);
      setError(getChatErrorMessage(err, t('chat.sendFailed'), t));
      setErrorKind('send');
    } finally {
      setSending(false);
    }
  };

  const handleRetry = () => {
    const kind = errorKind;
    if (!kind) return;
    setError(null);
    setErrorKind(null);
    if (kind === 'bootstrap') void bootstrap();
    else if (kind === 'messages' && selectedId) void fetchMessages(selectedId);
    else if (kind === 'send') void handleSend();
    else if (kind === 'newChat') void handleNewChat();
    else if (kind === 'delete') void handleBulkDelete();
  };

  if (!token) return null;

  return (
    <>
      {!open && (
        <Fab
          color="primary"
          aria-label={t('chat.openAssistant')}
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            right: 24,
            bottom: 24,
            zIndex: (theme) => theme.zIndex.modal - 1,
            overflow: 'visible',
            '&:hover': { overflow: 'visible' },
          }}
        >
          <SmartToyIcon />
          <Box
            component="span"
            aria-hidden
            sx={{
              position: 'absolute',
              top: -4,
              left: -4,
              zIndex: 2,
              pointerEvents: 'none',
              minWidth: 30,
              height: 22,
              px: 0.75,
              borderRadius: 11,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.625rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: 'primary.main',
              bgcolor: 'background.paper',
              border: '2px solid',
              borderColor: 'primary.main',
              boxShadow: 2,
            }}
          >
            AI
          </Box>
        </Fab>
      )}

      <Drawer
        key={i18n.language}
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ zIndex: (theme) => theme.zIndex.modal }}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 525 },
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          },
        }}
        ModalProps={{
          keepMounted: false,
          sx: { zIndex: (theme) => theme.zIndex.modal },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" component="span">
            {t('chat.title')}
          </Typography>
          <IconButton onClick={() => setOpen(false)} aria-label={t('chat.close')}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            alignItems: 'stretch',
          }}
        >
          {!bulkMode ? (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControl size="small" fullWidth>
                <InputLabel id="chat-conv-label">{t('chat.conversation')}</InputLabel>
                <Select
                  labelId="chat-conv-label"
                  value={selectedId ?? ''}
                  label={t('chat.conversation')}
                  onChange={handleSelectConversation}
                  disabled={listLoading || conversations.length === 0}
                >
                  {conversations.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.title?.trim() || t('chat.untitledChat')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Tooltip title={t('chat.newChat')}>
                <IconButton
                  onClick={() => void handleNewChat()}
                  aria-label={t('chat.newChat')}
                  disabled={listLoading}
                >
                  <AddCommentIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('chat.renameChat')}>
                <span>
                  <IconButton
                    onClick={openRenameDialog}
                    aria-label={t('chat.renameChat')}
                    disabled={listLoading || !selectedId}
                  >
                    <EditIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={t('chat.manageChats')}>
                <span>
                  <IconButton
                    onClick={() => setBulkMode(true)}
                    aria-label={t('chat.manageChats')}
                    disabled={listLoading || conversations.length === 0}
                  >
                    <DeleteSweepIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button size="small" onClick={exitBulkMode}>
                  {t('chat.doneSelecting')}
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  disabled={selectedForDelete.length === 0 || deleting}
                  onClick={() => void handleBulkDelete()}
                >
                  {deleting ? (
                    <CircularProgress size={18} />
                  ) : (
                    t('chat.deleteSelected', { count: selectedForDelete.length })
                  )}
                </Button>
              </Box>
              <Box
                sx={{
                  maxHeight: 220,
                  overflowY: 'auto',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  py: 0.5,
                }}
              >
                {conversations.map((c) => (
                  <Box
                    key={c.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      py: 0.5,
                      px: 1,
                    }}
                  >
                    <Checkbox
                      size="small"
                      checked={selectedForDelete.includes(c.id)}
                      onChange={() => toggleSelectForDelete(c.id)}
                      inputProps={{
                        'aria-label': c.title?.trim() || t('chat.untitledChat'),
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ flex: 1, cursor: 'pointer' }}
                      onClick={() => toggleSelectForDelete(c.id)}
                    >
                      {c.title?.trim() || t('chat.untitledChat')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mx: 2, mb: 1 }}
            onClose={() => {
              setError(null);
              setErrorKind(null);
            }}
            action={
              errorKind ? (
                <Button color="inherit" size="small" onClick={handleRetry}>
                  {t('chat.retry')}
                </Button>
              ) : undefined
            }
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            flex: 1,
            position: 'relative',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'grey.50',
          }}
        >
          {showScrollTop && (
            <Tooltip title={t('chat.goToTop')}>
              <IconButton
                size="small"
                color="primary"
                aria-label={t('chat.goToTop')}
                onClick={scrollToTop}
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 2,
                  boxShadow: 3,
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    color: 'primary.contrastText',
                  },
                }}
              >
                <KeyboardArrowUpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Box
            ref={scrollRef}
            onScroll={handleMessagesScroll}
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              px: 2,
              py: 1,
            }}
          >
            {listLoading || messagesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={32} />
              </Box>
            ) : messages.length === 0 ? (
              <Typography color="text.secondary" variant="body2" sx={{ py: 2 }}>
                {t('chat.emptyThread')}
              </Typography>
            ) : (
              messages.map((m) => (
                <Box
                  key={m.id}
                  sx={{
                    mb: 1.5,
                    display: 'flex',
                    justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '90%',
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: (theme) =>
                        m.role === 'user'
                          ? theme.palette.primary.light
                          : theme.palette.mode === 'light'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[800],
                      color:
                        m.role === 'user'
                          ? 'primary.contrastText'
                          : 'text.primary',
                      boxShadow: 1,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {m.role === 'user' ? (
                      <Typography
                        variant="caption"
                        sx={{ opacity: 0.85, display: 'block', mb: 0.5 }}
                      >
                        {t('chat.you')}
                      </Typography>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                          mb: 0.5,
                        }}
                      >
                        <SmartToyIcon
                          sx={{
                            fontSize: 15,
                            flexShrink: 0,
                            color: 'primary.main',
                            animation: `${assistantIconPulse} 2.2s ease-in-out infinite`,
                          }}
                        />
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          {t('chat.assistant')}
                        </Typography>
                      </Box>
                    )}
                    <Typography variant="body2">{m.content}</Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            gap: 1,
            alignItems: 'flex-end',
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            size="small"
            placeholder={t('chat.inputPlaceholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sending || !selectedId}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
          />
          <Button
            variant="contained"
            disabled={sending || !input.trim() || !selectedId}
            onClick={() => void handleSend()}
            sx={{ minWidth: 48, px: 1.5 }}
          >
            {sending ? <CircularProgress size={22} color="inherit" /> : <SendIcon />}
          </Button>
        </Box>
      </Drawer>

      <Dialog
        open={renameOpen}
        onClose={() => !renameSaving && setRenameOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{t('chat.renameDialogTitle')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={renameDraft}
            onChange={(e) => setRenameDraft(e.target.value)}
            placeholder={t('chat.untitledChat')}
            inputProps={{ maxLength: 200 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void handleRenameSave();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)} disabled={renameSaving}>
            {t('chat.renameCancel')}
          </Button>
          <Button
            variant="contained"
            onClick={() => void handleRenameSave()}
            disabled={renameSaving}
          >
            {renameSaving ? <CircularProgress size={20} /> : t('chat.renameSave')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

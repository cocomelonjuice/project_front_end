import { axiosInstance } from '../../../shared/api/src';

export interface ChatConversation {
  id: string;
  userId: string;
  projectId: string | null;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export const chatApi = {
  listConversations: () =>
    axiosInstance.get<ChatConversation[]>('/chat/conversations'),

  createConversation: (body?: { projectId?: string; title?: string }) =>
    axiosInstance.post<ChatConversation>('/chat/conversations', body ?? {}),

  /** POST avoids proxies/old stacks that return 404 on PATCH (same pattern as /remove). */
  updateConversation: (conversationId: string, body: { title: string }) =>
    axiosInstance.post<ChatConversation>(
      `/chat/conversations/${conversationId}/update`,
      body,
    ),

  getMessages: (conversationId: string) =>
    axiosInstance.get<ChatMessage[]>(
      `/chat/conversations/${conversationId}/messages`,
    ),

  sendMessage: (conversationId: string, content: string) =>
    axiosInstance.post<{
      userMessage: ChatMessage;
      assistantMessage: ChatMessage;
    }>(
      `/chat/conversations/${conversationId}/messages`,
      { content },
      { timeout: 130_000 },
    ),

  /** POST remove avoids clients/proxies that mishandle DELETE; same auth as messaging. */
  deleteConversation: (conversationId: string) =>
    axiosInstance.post(`/chat/conversations/${conversationId}/remove`),

  deleteConversations: async (ids: string[]): Promise<{ deleted: number }> => {
    const unique = [...new Set(ids)];
    await Promise.all(
      unique.map((id) =>
        axiosInstance.post(`/chat/conversations/${id}/remove`),
      ),
    );
    return { deleted: unique.length };
  },
};

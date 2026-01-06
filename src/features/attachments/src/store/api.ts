/**
 * Attachments Feature API
 */

import { axiosInstance } from '../../../../shared/api/src';
import { API_ENDPOINTS } from '../../../../shared/constants/src/api';
import { transformAttachment, transformAttachments } from './apiTransformers';
import type { Attachment } from './states';

// Backend Attachment response structure
interface BackendAttachment {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  filePath: string;
  issue: {
    id: string;
  };
  uploadedBy: {
    id: string;
    username: string;
    email: string;
    displayName: string;
  };
  createdAt: string | Date;
}

export const attachmentsApi = {
  // Upload attachment for an issue
  uploadAttachment: (issueId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance
      .post<BackendAttachment>(API_ENDPOINTS.ATTACHMENTS.CREATE(issueId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => ({
        ...response,
        data: transformAttachment(response.data),
      }));
  },

  // Get all attachments for an issue
  getAttachmentsByIssue: (issueId: string) =>
    axiosInstance.get<BackendAttachment[]>(API_ENDPOINTS.ATTACHMENTS.GET_BY_ISSUE(issueId)).then((response) => ({
      ...response,
      data: transformAttachments(response.data || []),
    })),

  // Get attachment by ID
  getAttachmentById: (id: string) =>
    axiosInstance.get<BackendAttachment>(API_ENDPOINTS.ATTACHMENTS.GET_BY_ID(id)).then((response) => ({
      ...response,
      data: transformAttachment(response.data),
    })),

  // Download attachment
  downloadAttachment: (id: string) =>
    axiosInstance.get(API_ENDPOINTS.ATTACHMENTS.DOWNLOAD(id), {
      responseType: 'blob',
    }),

  // Delete attachment
  deleteAttachment: (id: string) => axiosInstance.delete<void>(API_ENDPOINTS.ATTACHMENTS.DELETE(id)),
};

export default attachmentsApi;


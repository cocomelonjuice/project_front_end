/**
 * API Transformers for Attachments
 * Transforms backend API responses to frontend format
 */

import type { Attachment } from './states';

// Backend Attachment response structure
interface BackendAttachment {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  filePath: string | null;
  storageProvider?: string | null;
  storageKey?: string | null;
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

/**
 * Transform backend attachment to frontend attachment
 */
export const transformAttachment = (backendAttachment: BackendAttachment): Attachment => {
  return {
    id: backendAttachment.id,
    filename: backendAttachment.filename,
    originalFilename: backendAttachment.originalFilename,
    mimeType: backendAttachment.mimeType,
    size: backendAttachment.size,
    filePath: backendAttachment.filePath,
    storageProvider: backendAttachment.storageProvider ?? null,
    storageKey: backendAttachment.storageKey ?? null,
    issueId: backendAttachment.issue.id,
    uploadedById: backendAttachment.uploadedBy.id,
    uploadedBy: {
      id: backendAttachment.uploadedBy.id,
      username: backendAttachment.uploadedBy.username,
      email: backendAttachment.uploadedBy.email,
      displayName: backendAttachment.uploadedBy.displayName,
    },
    createdAt:
      backendAttachment.createdAt instanceof Date
        ? backendAttachment.createdAt.toISOString()
        : backendAttachment.createdAt,
  };
};

/**
 * Transform array of backend attachments to frontend attachments
 */
export const transformAttachments = (backendAttachments: BackendAttachment[]): Attachment[] => {
  return backendAttachments.map(transformAttachment);
};





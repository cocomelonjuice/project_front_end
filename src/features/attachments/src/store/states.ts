/**
 * Attachments Feature State
 */

import type { User } from '../../../issues/src/store/states';
import type { Issue } from '../../../issues/src/store/states';

export interface Attachment {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number; // File size in bytes
  filePath: string | null;
  storageProvider?: string | null;
  storageKey?: string | null;
  issueId: string;
  issue?: Issue;
  uploadedById: string;
  uploadedBy?: User;
  createdAt: string;
}

export interface CreateAttachmentData {
  file: File;
  issueId: string;
  uploadedById: string;
}

// Initial state
const initialState = {
  attachments: [] as Attachment[],
  currentAttachment: null as Attachment | null,
  getAttachmentsLoading: false,
  getAttachmentByIdLoading: false,
  uploadAttachmentLoading: false,
  deleteAttachmentLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type AttachmentsState = typeof initialState;
export default initialState;


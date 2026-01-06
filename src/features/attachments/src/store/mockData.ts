/**
 * Mock Data for Attachments Feature
 * Used for UI testing without backend
 */

import type { Attachment } from './states';
import { mockUsers } from '../../../issues/src/store/mockData';

// Helper to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Helper to get file icon based on mime type
export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video_file';
  if (mimeType.startsWith('audio/')) return 'audio_file';
  if (mimeType.includes('pdf')) return 'picture_as_pdf';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'description';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'table_chart';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'folder_zip';
  return 'insert_drive_file';
};

// Mock attachments
export const mockAttachments: Attachment[] = [
  {
    id: '1',
    filename: '1699123456789-abc123.png',
    originalFilename: 'screenshot.png',
    mimeType: 'image/png',
    size: 245760, // 240 KB
    filePath: '/uploads/1699123456789-abc123.png',
    issueId: '1',
    uploadedById: '1',
    uploadedBy: mockUsers[0],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    filename: '1699123456790-def456.pdf',
    originalFilename: 'requirements.pdf',
    mimeType: 'application/pdf',
    size: 1048576, // 1 MB
    filePath: '/uploads/1699123456790-def456.pdf',
    issueId: '1',
    uploadedById: '2',
    uploadedBy: mockUsers[1],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    filename: '1699123456791-ghi789.docx',
    originalFilename: 'design-document.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 524288, // 512 KB
    filePath: '/uploads/1699123456791-ghi789.docx',
    issueId: '2',
    uploadedById: '2',
    uploadedBy: mockUsers[1],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    filename: '1699123456792-jkl012.zip',
    originalFilename: 'source-code.zip',
    mimeType: 'application/zip',
    size: 2097152, // 2 MB
    filePath: '/uploads/1699123456792-jkl012.zip',
    issueId: '4',
    uploadedById: '3',
    uploadedBy: mockUsers[2],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    filename: '1699123456793-mno345.jpg',
    originalFilename: 'ui-mockup.jpg',
    mimeType: 'image/jpeg',
    size: 786432, // 768 KB
    filePath: '/uploads/1699123456793-mno345.jpg',
    issueId: '4',
    uploadedById: '4',
    uploadedBy: mockUsers[3],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Flag to use mock data
export const USE_MOCK_DATA = false;

// Helper to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to generate next attachment ID
export const getNextAttachmentId = (): string => {
  const maxId = mockAttachments.reduce((max, att) => {
    const numId = parseInt(att.id);
    return numId > max ? numId : max;
  }, 0);
  return String(maxId + 1);
};



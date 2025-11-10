import { AxiosError } from 'axios';

/**
 * Error handler utilities
 */
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    if ('response' in error) {
      const axiosError = error as AxiosError;
      return {
        message: (axiosError.response?.data as any)?.message || axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      };
    }
    return {
      message: error.message,
    };
  }
  return {
    message: 'An unknown error occurred',
  };
}


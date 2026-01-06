/**
 * API Transformers for Labels
 * Transforms backend API responses to frontend format
 */

import type { Label } from './states';

// Backend Label response structure
interface BackendLabel {
  id: string;
  name: string;
  color?: string;
  description?: string;
}

/**
 * Transform backend label to frontend label
 */
export const transformLabel = (backendLabel: BackendLabel): Label => {
  return {
    id: backendLabel.id,
    name: backendLabel.name,
    color: backendLabel.color,
    description: backendLabel.description,
  };
};

/**
 * Transform array of backend labels to frontend labels
 */
export const transformLabels = (backendLabels: BackendLabel[]): Label[] => {
  return backendLabels.map(transformLabel);
};





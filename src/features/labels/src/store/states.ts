/**
 * Labels Feature State
 */

export interface Label {
  id: string;
  name: string;
  color?: string; // Hex color code (e.g., #FF5733)
  description?: string;
}

export interface CreateLabelData {
  name: string;
  color?: string;
  description?: string;
}

export interface UpdateLabelData {
  name?: string;
  color?: string;
  description?: string;
}

// Initial state
const initialState = {
  labels: [] as Label[],
  currentLabel: null as Label | null,
  getLabelsLoading: false,
  getLabelByIdLoading: false,
  createLabelLoading: false,
  updateLabelLoading: false,
  deleteLabelLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type LabelsState = typeof initialState;
export default initialState;



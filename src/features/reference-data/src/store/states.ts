/**
 * Reference Data Feature State
 */

export interface IssueType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface Priority {
  id: string;
  name: string;
  orderNum: number;
  level?: number;
  color?: string;
}

export interface Status {
  id: string;
  name: string;
  category: string;
  color?: string;
}

// Initial state
const initialState = {
  issueTypes: [] as IssueType[],
  priorities: [] as Priority[],
  statuses: [] as Status[],
  getIssueTypesLoading: false,
  getPrioritiesLoading: false,
  getStatusesLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type ReferenceDataState = typeof initialState;
export default initialState;








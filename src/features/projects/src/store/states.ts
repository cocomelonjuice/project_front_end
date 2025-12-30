/**
 * Projects Feature State
 */

export interface Project {
  id: string;
  key: string;
  name: string;
  type: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Initial state
const initialState = {
  projects: [] as Project[],
  currentProject: null as Project | null,
  getProjectsLoading: false,
  getProjectByIdLoading: false,
  createProjectLoading: false,
  updateProjectLoading: false,
  deleteProjectLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type ProjectsState = typeof initialState;
export default initialState;






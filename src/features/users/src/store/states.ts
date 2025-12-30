/**
 * Users Feature State
 */

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Initial state
const initialState = {
  users: [] as User[],
  currentUser: null as User | null,
  getUsersLoading: false,
  getUserByIdLoading: false,
  errors: null as Array<{ type: string; msg: string }> | null,
};

export type UsersState = typeof initialState;
export default initialState;









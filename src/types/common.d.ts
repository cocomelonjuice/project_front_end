/**
 * Common Types
 */
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}


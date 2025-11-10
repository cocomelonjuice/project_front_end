/**
 * Example Feature State
 * Similar to portal feature stores pattern
 */

export const errors: Array<{ type: string; msg: string }> = [];

// Example: Feature-specific state
export const exampleData: { id?: string; name?: string } | null = null;
export const getExampleDataLoading: boolean = false;
export const getExampleDataResponse: { id?: string; name?: string } | null = null;

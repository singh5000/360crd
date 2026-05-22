export type ApiResponse<T> = {
  data: T;
  message?: string;
  meta?: { page?: number; pageSize?: number; total?: number };
};

export type ApiError = {
  status: number;
  code?: string;
  message: string;
  details?: unknown;
};

export type AsyncState<T> = {
  data: T;
  loading: boolean;
  error: ApiError | null;
  initialized: boolean;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

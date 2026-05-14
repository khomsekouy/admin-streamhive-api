export interface PaginationInput {
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const normalizePagination = (
  input: PaginationInput | undefined,
): { page: number; pageSize: number; skip: number; take: number } => {
  const page = Math.max(1, Math.floor(input?.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Math.floor(input?.pageSize ?? 20)));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
};

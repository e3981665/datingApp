export interface PaginationMetadata {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  metadata: PaginationMetadata;
  items: T[];
}

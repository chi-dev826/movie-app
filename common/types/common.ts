// 共通型定義
export type PaginatedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type DefaultResponse<T> = {
  id: number;
  results: T[];
};

export interface IPagedData<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
}

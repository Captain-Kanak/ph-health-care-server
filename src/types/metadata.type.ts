export interface MetaData {
  currentPage: number;
  limit: number;
  skip: number;
  totalPages: number;
  [key: string]: number;
}

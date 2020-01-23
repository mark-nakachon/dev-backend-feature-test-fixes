export class PageDto<T> {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly totalPage: number;
  readonly totalCount: number;
  readonly data: T;

  constructor(
    result: T,
    count: number,
    pages: number,
    page: number,
    perPage: number,
  ) {
    this.currentPage = page;
    this.pageSize = perPage;
    this.totalPage = pages;
    this.totalCount = count;
    this.data = result;
  }
}

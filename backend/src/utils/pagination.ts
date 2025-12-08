export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export function getPagination(page: number = 1, pageSize: number = DEFAULT_PAGE_SIZE) {
  const safePage = page < 1 ? 1 : page;
  const safeSize =
    pageSize < 1 ? DEFAULT_PAGE_SIZE : Math.min(pageSize, MAX_PAGE_SIZE);

  const from = (safePage - 1) * safeSize;
  const to = from + safeSize - 1;

  return { from, to, page: safePage, pageSize: safeSize };
}

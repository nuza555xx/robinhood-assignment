export class Pagination {
  static createPagination(next = 0, size = 10) {
    const skip = next;
    const limit = size;

    return { skip, limit };
  }

  static paginationResponse<T>(
    results: T[],
    next: number,
    size: number,
    total?: number,
  ) {
    return {
      results,
      meta: {
        previous: next,
        next: (next ?? 0) + size,
        resultCount: results.length,
        resultTotal: total,
      },
    };
  }
}

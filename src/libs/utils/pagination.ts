import { ApiProperty } from '@nestjs/swagger';

export class Meta {
  @ApiProperty()
  previous: number;

  @ApiProperty()
  next: number;

  @ApiProperty()
  resultCount: number;

  @ApiProperty()
  resultTotal: number;
}

export class PaginationResponse<TData = any> {
  @ApiProperty({ type: Meta })
  meta: Meta;

  results: TData[];
}

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
  ): PaginationResponse<T> {
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

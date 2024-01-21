import { ApiProperty } from '@nestjs/swagger';
import { Meta, PaginationResponse } from '@utils';

export class ChangelogResponse {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdBy: string;
}

export class ChangelogPaginationResponse implements PaginationResponse {
  @ApiProperty({ type: [ChangelogResponse] })
  results: ChangelogResponse[];

  @ApiProperty()
  meta: Meta;
}

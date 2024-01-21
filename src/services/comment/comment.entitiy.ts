import { ApiProperty } from '@nestjs/swagger';

export class CommentResponse {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdBy: string;
}

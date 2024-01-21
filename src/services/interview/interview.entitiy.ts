import { ApiProperty } from '@nestjs/swagger';

export class InterviewResponse {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdBy: string;
}

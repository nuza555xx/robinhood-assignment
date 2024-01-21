import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';

@Module({
  imports: [],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}

import { Module } from '@nestjs/common';
import { ChangelogService } from './log.service';
import { ChangelogController } from './log.controller';

@Module({
  imports: [],
  controllers: [ChangelogController],
  providers: [ChangelogService],
})
export class ChangelogModule {}

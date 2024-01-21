import { Controller, Get, Query } from '@nestjs/common';
import { ChangelogService } from './log.service';
import { GetChangelogQuery } from './log.dto';
import { Authorize } from '@decorators';
import { ApiTags } from '@nestjs/swagger';

@Authorize()
@ApiTags('logs')
@Controller('logs')
export class ChangelogController {
  constructor(private readonly logService: ChangelogService) {}

  @Get()
  logs(@Query() query: GetChangelogQuery): Promise<any> {
    return this.logService.logs(query);
  }
}

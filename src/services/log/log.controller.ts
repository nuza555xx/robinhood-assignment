import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ChangelogService } from './log.service';
import { GetChangelogQuery } from './log.dto';
import { Authorize, ApiPaginatedResponse } from '@decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangelogPaginationResponse, ChangelogResponse } from './log.entitiy';

@Authorize()
@ApiTags('logs')
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Missing authorization header.',
})
@Controller('logs')
export class ChangelogController {
  constructor(private readonly logService: ChangelogService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: ChangelogPaginationResponse,
  })
  @ApiPaginatedResponse(ChangelogResponse)
  @Get()
  logs(@Query() query: GetChangelogQuery): Promise<any> {
    return this.logService.logs(query);
  }
}

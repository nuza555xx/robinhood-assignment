import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { InterviewService } from './interview.service';
import {
  CreateInterviewDto,
  GetIdParam,
  GetInterviewQuery,
  UpdateInterviewDto,
} from './interview.dto';
import { Auth, Authorize, Authorizer } from '@decorators';
import { ApiTags } from '@nestjs/swagger';

@Authorize()
@ApiTags('interviews')
@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get()
  interviews(@Query() query: GetInterviewQuery): Promise<any> {
    return this.interviewService.interviews(query);
  }

  @Get(':id')
  interview(@Param() { id }: GetIdParam): Promise<any> {
    return this.interviewService.interview(id);
  }

  @Post('create')
  @HttpCode(HttpStatus.NO_CONTENT)
  createInterview(
    @Auth() { account }: Authorizer,
    @Body() body: CreateInterviewDto,
  ) {
    return this.interviewService.createInterview(body, account.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateInterview(
    @Auth() { account }: Authorizer,
    @Param() { id }: GetIdParam,
    @Body() body: UpdateInterviewDto,
  ) {
    return this.interviewService.updateInterview(id, body, account.id);
  }

  @Patch('archive/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  archive(@Auth() { account }: Authorizer, @Param() { id }: GetIdParam) {
    return this.interviewService.archive(id, account.id);
  }
}

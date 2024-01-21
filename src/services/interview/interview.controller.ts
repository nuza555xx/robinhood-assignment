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
import { Auth, Authorize, Authorizer, ApiPaginatedResponse } from '@decorators';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InterviewResponse } from './interview.entitiy';

@Authorize()
@ApiTags('interviews')
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Missing authorization header.',
})
@Controller('interviews')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @ApiPaginatedResponse(InterviewResponse)
  @Get()
  interviews(@Query() query: GetInterviewQuery): Promise<any> {
    return this.interviewService.interviews(query);
  }

  @ApiOkResponse({
    status: HttpStatus.OK,
    type: InterviewResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not fount data. Please try again.',
  })
  @Get(':id')
  interview(@Param() { id }: GetIdParam): Promise<any> {
    return this.interviewService.interview(id);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @Post('create')
  @HttpCode(HttpStatus.NO_CONTENT)
  createInterview(
    @Auth() { account }: Authorizer,
    @Body() body: CreateInterviewDto,
  ) {
    return this.interviewService.createInterview(body, account.id);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not fount data. Please try again.',
  })
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateInterview(
    @Auth() { account }: Authorizer,
    @Param() { id }: GetIdParam,
    @Body() body: UpdateInterviewDto,
  ) {
    return this.interviewService.updateInterview(id, body, account.id);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not fount data. Please try again.',
  })
  @Patch('archive/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  archive(@Auth() { account }: Authorizer, @Param() { id }: GetIdParam) {
    return this.interviewService.archive(id, account.id);
  }
}

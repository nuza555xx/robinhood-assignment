import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import {
  CreateCommentDto,
  GetIdParam,
  GetCommentQuery,
  UpdateCommentDto,
} from './comment.dto';
import { ApiPaginatedResponse, Auth, Authorize, Authorizer } from '@decorators';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CommentResponse } from './comment.entitiy';
import { ErrorsCode } from '@exception';

@Authorize()
@ApiTags('comments')
@ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: ErrorsCode['RATE_LIMIT_REQUEST'].message,
})
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiPaginatedResponse(CommentResponse)
  @Get()
  comments(@Query() query: GetCommentQuery) {
    return this.commentService.comments(query);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @Post('create')
  @HttpCode(HttpStatus.NO_CONTENT)
  createComment(
    @Auth() { account }: Authorizer,
    @Body() body: CreateCommentDto,
  ) {
    return this.commentService.createComment(body, account.id);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiResponse({
    status: ErrorsCode['FORBIDDEN'].statusCode,
    description: ErrorsCode['FORBIDDEN'].message,
  })
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateComment(
    @Auth() { account }: Authorizer,
    @Param() { id }: GetIdParam,
    @Body() body: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(id, body, account.id);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiResponse({
    status: ErrorsCode['FORBIDDEN'].statusCode,
    description: ErrorsCode['FORBIDDEN'].message,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComment(@Auth() { account }: Authorizer, @Param() { id }: GetIdParam) {
    return this.commentService.deleteComment(id, account.id);
  }
}

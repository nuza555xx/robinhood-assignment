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
import { Auth, Authorize, Authorizer } from '@decorators';
import { ApiTags } from '@nestjs/swagger';

@Authorize()
@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  comments(@Query() query: GetCommentQuery): Promise<any> {
    return this.commentService.comments(query);
  }

  @Post('create')
  @HttpCode(HttpStatus.NO_CONTENT)
  createComment(
    @Auth() { account }: Authorizer,
    @Body() body: CreateCommentDto,
  ) {
    return this.commentService.createComment(body, account.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateComment(
    @Auth() { account }: Authorizer,
    @Param() { id }: GetIdParam,
    @Body() body: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(id, body, account.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComment(@Auth() { account }: Authorizer, @Param() { id }: GetIdParam) {
    return this.commentService.deleteComment(id, account.id);
  }
}

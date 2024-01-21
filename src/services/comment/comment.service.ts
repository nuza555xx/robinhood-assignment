import { Inject, Injectable } from '@nestjs/common';
import {
  CreateCommentDto,
  GetCommentQuery,
  UpdateCommentDto,
} from './comment.dto';
import { MergeType, Types } from 'mongoose';
import {
  RepositoryProvider,
  Repository,
  Comment,
  Account,
} from '@repositories';
import { Pagination } from '@utils';
import { Exception } from '@exception';
import { CommentStatus, Sorting } from '@enums';

@Injectable()
export class CommentService {
  constructor(
    @Inject(RepositoryProvider.COMMENT)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  private toCommentResponse({
    _id,
    content,
    createdAt,
    createdBy,
  }: MergeType<Comment<Account>, Account>) {
    return {
      _id,
      content,
      createdAt,
      createdBy: createdBy.displayName,
    };
  }

  private async isAccessAccount(accountId: Types.ObjectId) {
    const accessWrite = await this.commentRepo.findOne({
      status: CommentStatus.PUBLISH,
      createdBy: accountId,
    });

    return !!accessWrite;
  }

  async createComment(body: CreateCommentDto, accountId: Types.ObjectId) {
    await this.commentRepo.insertOne({
      ...body,
      createdBy: accountId,
      updatedBy: accountId,
    });
  }

  async comments(query: GetCommentQuery) {
    const { skip, limit } = Pagination.createPagination(
      query?.next,
      query?.size,
    );

    const [commentsQuery, commentCount] = await Promise.all([
      this.commentRepo.findMany<Comment<Account>>(
        {
          refBy: new Types.ObjectId(query.refBy),
          status: CommentStatus.PUBLISH,
        },
        {},
        {
          skip,
          limit,
          sort: { [query?.sort || 'createdAt']: query?.sortBy || Sorting.DESC },
        },
      ),
      this.commentRepo.count({ status: CommentStatus.PUBLISH }),
    ]);

    const comments = await Promise.all(
      commentsQuery.map(async (comment) => {
        const commentAccount = await comment.populate<Account>('createdBy');
        return this.toCommentResponse(commentAccount);
      }),
    );

    const response = Pagination.paginationResponse(
      comments,
      skip,
      limit,
      commentCount,
    );

    return response;
  }

  async updateComment(
    id: string,
    body: UpdateCommentDto,
    accountId: Types.ObjectId,
  ) {
    await this.commentRepo.transaction(async () => {
      const isAccessAccount = await this.isAccessAccount(accountId);
      if (!isAccessAccount) throw new Exception('FORBIDDEN');

      await this.commentRepo.updateById(new Types.ObjectId(id), {
        $set: { ...body, updatedBy: accountId },
      });
    });
  }

  async deleteComment(id: string, accountId: Types.ObjectId) {
    await this.commentRepo.transaction(async () => {
      const isAccessAccount = await this.isAccessAccount(accountId);
      if (!isAccessAccount) throw new Exception('FORBIDDEN');

      await this.commentRepo.updateById(new Types.ObjectId(id), {
        $set: { status: CommentStatus.DELETED, updatedBy: accountId },
      });
    });
  }
}

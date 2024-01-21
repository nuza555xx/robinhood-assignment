import { Inject, Injectable } from '@nestjs/common';
import { GetChangelogQuery } from './log.dto';
import { MergeType, Types } from 'mongoose';
import {
  RepositoryProvider,
  Repository,
  Changelog,
  Account,
} from '@repositories';
import { Pagination } from '@utils';
import { Sorting } from '@enums';

@Injectable()
export class ChangelogService {
  constructor(
    @Inject(RepositoryProvider.LOG)
    private readonly logRepo: Repository<Changelog>,
  ) {}

  private toChangelogResponse({
    _id,
    title,
    description,
    status,
    createdAt,
    createdBy,
  }: MergeType<Changelog<Account>, Account>) {
    return {
      _id,
      title,
      description,
      status,
      createdAt,
      createdBy: createdBy.displayName,
    };
  }

  async logs(query: GetChangelogQuery) {
    const { skip, limit } = Pagination.createPagination(
      query?.next,
      query?.size,
    );

    const [logsQuery, logCount] = await Promise.all([
      this.logRepo.findMany<Changelog<Account>>(
        {
          refBy: new Types.ObjectId(query.refBy),
        },
        {},
        {
          skip,
          limit,
          sort: { [query?.sort || 'createdAt']: query?.sortBy || Sorting.DESC },
        },
      ),
      this.logRepo.count({}),
    ]);

    const logs = await Promise.all(
      logsQuery.map(async (log) => {
        const logAccount = await log.populate<Account>('createdBy');
        return this.toChangelogResponse(logAccount);
      }),
    );

    const response = Pagination.paginationResponse(logs, skip, limit, logCount);

    return response;
  }
}

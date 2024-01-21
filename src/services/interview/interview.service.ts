import { Inject, Injectable } from '@nestjs/common';
import {
  CreateInterviewDto,
  GetInterviewQuery,
  UpdateInterviewDto,
} from './interview.dto';
import { MergeType, Types } from 'mongoose';
import {
  RepositoryProvider,
  Repository,
  Interview,
  Account,
  Changelog,
} from '@repositories';
import { Pagination } from '@utils';
import { Exception } from '@exception';
import { Sorting } from '@enums';

@Injectable()
export class InterviewService {
  constructor(
    @Inject(RepositoryProvider.INTERVIEW)
    private readonly interviewRepo: Repository<Interview>,

    @Inject(RepositoryProvider.LOG)
    private readonly logRepo: Repository<Changelog>,
  ) {}

  private toInterviewResponse({
    _id,
    title,
    description,
    status,
    createdAt,
    createdBy,
  }: MergeType<Interview<Account>, Account>) {
    return {
      _id,
      title,
      description,
      status,
      createdAt,
      createdBy: createdBy.displayName,
    };
  }

  async archive(id: string, accountId: Types.ObjectId) {
    await this.interviewRepo.updateById(new Types.ObjectId(id), {
      $set: { isArchive: true, updatedBy: accountId },
    });
  }

  async createInterview(body: CreateInterviewDto, accountId: Types.ObjectId) {
    await this.interviewRepo.transaction(async () => {
      await this.interviewRepo.insertOne({
        ...body,
        createdBy: accountId,
        updatedBy: accountId,
      });
    });
  }

  async interviews(query: GetInterviewQuery) {
    const { skip, limit } = Pagination.createPagination(
      query?.next,
      query?.size,
    );

    const [interviewsQuery, interviewCount] = await Promise.all([
      this.interviewRepo.findMany<Interview<Account>>(
        { isArchive: false },
        {},
        {
          skip,
          limit,
          sort: { [query?.sort || 'createdAt']: query?.sortBy || Sorting.DESC },
        },
      ),
      this.interviewRepo.count({ isArchive: false }),
    ]);

    const interviews = await Promise.all(
      interviewsQuery.map(async (interview) => {
        const interviewAccount = await interview.populate<Account>('createdBy');
        return this.toInterviewResponse(interviewAccount);
      }),
    );

    const response = Pagination.paginationResponse(
      interviews,
      skip,
      limit,
      interviewCount,
    );

    return response;
  }

  async interview(id: string) {
    const interviewQuery = await this.interviewRepo.findOne<Interview<Account>>(
      {
        _id: new Types.ObjectId(id),
        isArchive: false,
      },
    );

    if (!interviewQuery) throw new Exception('NOT_FOUND_DATA');

    const interview = await interviewQuery.populate<Account>('createdBy');

    return this.toInterviewResponse(interview);
  }

  async updateInterview(
    id: string,
    body: UpdateInterviewDto,
    accountId: Types.ObjectId,
  ) {
    await this.interviewRepo.transaction(async () => {
      const interviewQuery = await this.interviewRepo.findOne({
        _id: new Types.ObjectId(id),
      });

      if (!interviewQuery) throw new Exception('NOT_FOUND_DATA');

      await Promise.all([
        this.logRepo.insertOne({
          title: interviewQuery.title,
          description: interviewQuery.description,
          status: interviewQuery.status,
          refBy: new Types.ObjectId(id),
          createdBy: accountId,
          updatedBy: accountId,
        }),
        this.interviewRepo.updateById(new Types.ObjectId(id), {
          $set: { ...body, updatedBy: accountId },
        }),
      ]);
    });
  }
}

import { Global, Module } from '@nestjs/common';
import { ModelDefinition } from '@nestjs/mongoose';
import {
  Comment,
  Account,
  AccountSchema,
  CommentSchema,
  Interview,
  InterviewSchema,
  Changelog,
  ChangelogSchema,
} from './schemas';
import { MongooseModule } from '@modules';
import { RepositoryProvider } from './repository.enum';
import {
  AccountImplement,
  ChangelogImplement,
  CommentImplement,
  InterviewImplement,
} from './implements';

const modelDefinitions: ModelDefinition[] = [
  {
    name: Account.name,
    schema: AccountSchema,
  },
  {
    name: Comment.name,
    schema: CommentSchema,
  },
  {
    name: Interview.name,
    schema: InterviewSchema,
  },
  {
    name: Changelog.name,
    schema: ChangelogSchema,
  },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(modelDefinitions)],
  providers: [
    {
      provide: RepositoryProvider.ACCOUNT,
      useExisting: AccountImplement,
    },
    {
      provide: RepositoryProvider.INTERVIEW,
      useExisting: InterviewImplement,
    },
    {
      provide: RepositoryProvider.COMMENT,
      useExisting: CommentImplement,
    },
    {
      provide: RepositoryProvider.LOG,
      useExisting: ChangelogImplement,
    },
    AccountImplement,
    InterviewImplement,
    CommentImplement,
    ChangelogImplement,
  ],

  exports: [
    RepositoryProvider.ACCOUNT,
    RepositoryProvider.INTERVIEW,
    RepositoryProvider.COMMENT,
    RepositoryProvider.LOG,
  ],
})
export class RepositoryModule {}

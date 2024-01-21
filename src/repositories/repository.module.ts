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
      useClass: AccountImplement,
    },

    {
      provide: RepositoryProvider.INTERVIEW,
      useClass: InterviewImplement,
    },
    {
      provide: RepositoryProvider.COMMENT,
      useClass: CommentImplement,
    },
    {
      provide: RepositoryProvider.LOG,
      useClass: ChangelogImplement,
    },
  ],

  exports: [
    RepositoryProvider.ACCOUNT,
    RepositoryProvider.INTERVIEW,
    RepositoryProvider.COMMENT,
    RepositoryProvider.LOG,
  ],
})
export class RepositoryModule {}

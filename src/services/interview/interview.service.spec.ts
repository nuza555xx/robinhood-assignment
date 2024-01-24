import { Test, TestingModule } from '@nestjs/testing';
import { InterviewService } from './interview.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Repository,
  RepositoryProvider,
  Interview,
  InterviewSchema,
  InterviewImplement,
  Changelog,
  ChangelogSchema,
  ChangelogImplement,
} from '@repositories';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('InterviewService', () => {
  let moduleRef: TestingModule;
  let mongod: MongoMemoryServer;
  let interviewService: InterviewService;
  let interviewRepo: Repository<Interview>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          {
            name: Interview.name,
            schema: InterviewSchema,
          },
          {
            name: Changelog.name,
            schema: ChangelogSchema,
          },
        ]),
      ],
      providers: [
        InterviewService,
        {
          provide: RepositoryProvider.INTERVIEW,
          useClass: InterviewImplement,
        },
        {
          provide: RepositoryProvider.LOG,
          useClass: ChangelogImplement,
        },
      ],
    }).compile();

    interviewService = moduleRef.get<InterviewService>(InterviewService);
    interviewRepo = moduleRef.get<Repository<Interview>>(
      RepositoryProvider.INTERVIEW,
    );
  });

  afterAll(async () => {
    await mongod.stop();
    await moduleRef.close();
  });

  it('should be defined', () => {
    expect(interviewService).toBeDefined();
    expect(interviewRepo).toBeDefined();
  });
});

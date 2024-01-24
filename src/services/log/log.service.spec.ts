import { Test, TestingModule } from '@nestjs/testing';
import { ChangelogService } from './log.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Repository,
  RepositoryProvider,
  Changelog,
  ChangelogSchema,
  ChangelogImplement,
} from '@repositories';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('ChangelogService', () => {
  let moduleRef: TestingModule;
  let mongod: MongoMemoryServer;
  let logService: ChangelogService;
  let logRepo: Repository<Changelog>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          {
            name: Changelog.name,
            schema: ChangelogSchema,
          },
        ]),
      ],
      providers: [
        ChangelogService,
        {
          provide: RepositoryProvider.INTERVIEW,
          useClass: ChangelogImplement,
        },
        {
          provide: RepositoryProvider.LOG,
          useClass: ChangelogImplement,
        },
      ],
    }).compile();

    logService = moduleRef.get<ChangelogService>(ChangelogService);
    logRepo = moduleRef.get<Repository<Changelog>>(
      RepositoryProvider.INTERVIEW,
    );
  });

  afterAll(async () => {
    await mongod.stop();
    await moduleRef.close();
  });

  it('should be defined', () => {
    expect(logService).toBeDefined();
    expect(logRepo).toBeDefined();
  });
});

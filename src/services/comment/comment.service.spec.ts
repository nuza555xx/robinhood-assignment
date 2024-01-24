import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Repository,
  RepositoryProvider,
  Comment,
  CommentSchema,
  CommentImplement,
} from '@repositories';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('CommentService', () => {
  let moduleRef: TestingModule;
  let mongod: MongoMemoryServer;
  let commentService: CommentService;
  let commentRepo: Repository<Comment>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          {
            name: Comment.name,
            schema: CommentSchema,
          },
        ]),
      ],
      providers: [
        CommentService,
        {
          provide: RepositoryProvider.COMMENT,
          useClass: CommentImplement,
        },
      ],
    }).compile();

    commentService = moduleRef.get<CommentService>(CommentService);
    commentRepo = moduleRef.get<Repository<Comment>>(
      RepositoryProvider.COMMENT,
    );
  });

  afterAll(async () => {
    await mongod.stop();
    await moduleRef.close();
  });

  it('should be defined', () => {
    expect(commentService).toBeDefined();
    expect(commentRepo).toBeDefined();
  });
});

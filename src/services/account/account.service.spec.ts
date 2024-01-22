import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import {
  Account,
  AccountImplement,
  AccountSchema,
  Repository,
  RepositoryProvider,
} from '@repositories';
import { ConfigProvider, jwtConfig } from '@configs';
import { CreateAccountsDto } from './account.dto';
import { Hashing } from '@utils';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Exception } from '@exception';
describe('AccountService', () => {
  let moduleRef: TestingModule;
  let mongod: MongoMemoryServer;
  let accountService: AccountService;
  let accountRepo: Repository<Account>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          {
            name: Account.name,
            schema: AccountSchema,
          },
        ]),
      ],
      providers: [
        AccountService,
        {
          provide: ConfigProvider.JWT,
          useFactory: jwtConfig,
        },
        {
          provide: RepositoryProvider.ACCOUNT,
          useClass: AccountImplement,
        },
      ],
    }).compile();

    accountService = moduleRef.get<AccountService>(AccountService);
    accountRepo = moduleRef.get<Repository<Account>>(
      RepositoryProvider.ACCOUNT,
    );
  });

  afterAll(async () => {
    await mongod.stop();
    await moduleRef.close();
  });

  describe('createAccount', () => {
    const createAccountDto: CreateAccountsDto = {
      username: 'test_user',
      displayName: 'Test User',
      password: 'test_password',
    };

    it('should create an account', async () => {
      jest
        .spyOn(accountRepo, 'transaction')
        .mockImplementation(async (fn, ...args) => {
          fn(...args);
        });

      jest
        .spyOn(accountRepo, 'insertOne')
        .mockResolvedValue(createAccountDto as any);

      jest.spyOn(accountRepo, 'exists').mockResolvedValue(false);

      jest.spyOn(Hashing, 'hash').mockResolvedValue('hash_password');

      await accountService.createAccount(createAccountDto);

      expect(accountRepo.transaction).toHaveBeenCalledTimes(1);
      expect(Hashing.hash).toHaveBeenCalledTimes(1);

      expect(accountRepo.exists).toHaveBeenCalledWith({
        $or: [
          { username: createAccountDto.username },
          { displayName: createAccountDto.displayName },
        ],
      });
      expect(accountRepo.insertOne).toHaveBeenCalledWith(createAccountDto);
    });

    it('should throw an exception if username is already taken', async () => {
      jest.spyOn(accountRepo, 'exists').mockResolvedValue(true);

      await expect(
        async () => await accountService.createAccount(createAccountDto),
      ).rejects.toThrow(new Exception('USERNAME_IS_EXIST'));
    });

    // it('should throw an exception if something goes wrong during insertion', async () => {
    //   const createAccountDto: CreateAccountsDto = {
    //     // provide required data for testing
    //     username: 'testuser',
    //     displayName: 'Test User',
    //     password: 'testpassword',
    //   };

    //   // Mocking the behavior of accountRepo.exists and accountRepo.insertOne
    //   (accountRepo.exists as jest.Mock).mockResolvedValue(false);
    //   (accountRepo.insertOne as jest.Mock).mockResolvedValue(false);

    //   await expect(
    //     accountService.createAccount(createAccountDto),
    //   ).rejects.toThrow(Exception);
    // });
  });
});

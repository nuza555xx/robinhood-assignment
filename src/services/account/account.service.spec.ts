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
describe('AccountService', () => {
  let moduleRef: TestingModule;
  let mongod: MongoMemoryServer;
  let accountService: AccountService;
  let accountRepo: Repository<Account>;

  beforeAll(async () => {
    const mongod = await MongoMemoryServer.create();
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
    await moduleRef.close();
  });

  describe('createAccount', () => {
    it('should create an account', async () => {
      const createAccountDto: CreateAccountsDto = {
        // provide required data for testing
        username: 'testuser',
        displayName: 'Test User',
        password: 'testpassword',
      };

      jest
        .spyOn(Hashing, 'hash')
        .mockImplementation((password: string) => password);

      // // Mocking the behavior of accountRepo.exists and accountRepo.insertOne
      // (accountRepo.exists as jest.Mock).mockResolvedValue(false);
      // (accountRepo.insertOne as jest.Mock).mockResolvedValue(true);

      await accountService.createAccount(createAccountDto);

      // // Expectations based on your implementation
      // expect(accountRepo.transaction).toHaveBeenCalledTimes(1);
      // expect(Hashing.hash).toHaveBeenCalledWith(createAccountDto.password);
      // expect(accountRepo.exists).toHaveBeenCalledWith({
      //   $or: [
      //     { username: createAccountDto.username },
      //     { displayName: createAccountDto.displayName },
      //   ],
      // });
      // expect(accountRepo.insertOne).toHaveBeenCalledWith(createAccountDto);
    });

    // it('should throw an exception if username is already taken', async () => {
    //   const createAccountDto: CreateAccountsDto = {
    //     // provide required data for testing
    //     username: 'existinguser',
    //     displayName: 'Existing User',
    //     password: 'existingpassword',
    //   };

    //   // Mocking the behavior of accountRepo.exists to simulate username already exists
    //   (accountRepo.exists as jest.Mock).mockResolvedValue(true);

    //   await expect(
    //     accountService.createAccount(createAccountDto),
    //   ).rejects.toThrow(Exception);
    // });

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

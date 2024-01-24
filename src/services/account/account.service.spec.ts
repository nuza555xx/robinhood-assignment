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
import { CreateAccountsDto, LoginDto } from './account.dto';
import { Hashing } from '@utils';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Exception } from '@exception';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('AccountService', () => {
  let moduleRef: TestingModule;
  let mongod: MongoMemoryServer;
  let accountService: AccountService;
  let accountRepo: Repository<Account>;
  let jwtService: JwtService;

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
        JwtModule.register({
          secret: 'jwt-secret',
        }),
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
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token_sign'),
          },
        },
      ],
    }).compile();

    jwtService = moduleRef.get<JwtService>(JwtService);
    accountService = moduleRef.get<AccountService>(AccountService);
    accountRepo = moduleRef.get<Repository<Account>>(
      RepositoryProvider.ACCOUNT,
    );
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await mongod.stop();
    await moduleRef.close();
  });

  describe('createAccount', () => {
    const createAccountDto: CreateAccountsDto = {
      username: 'test_user',
      displayName: 'Test User',
      password: 'test_password',
    };

    beforeEach(() => {
      jest
        .spyOn(accountRepo, 'transaction')
        .mockImplementation(async (fn, ...args) => {
          try {
            await fn(...args);
          } catch (error) {
            return Promise.reject(error);
          }
        });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create an account', async () => {
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
      jest
        .spyOn(accountRepo, 'insertOne')
        .mockResolvedValue(createAccountDto as any);

      jest.spyOn(accountRepo, 'exists').mockResolvedValue(true);

      jest.spyOn(Hashing, 'hash').mockReturnValue('hash_password');

      await expect(
        accountService.createAccount(createAccountDto),
      ).rejects.toThrow(Exception);

      expect(accountRepo.transaction).toHaveBeenCalledTimes(1);
      expect(Hashing.hash).toHaveBeenCalledTimes(1);
      expect(accountRepo.exists).toHaveBeenCalledWith({
        $or: [
          { username: createAccountDto.username },
          { displayName: createAccountDto.displayName },
        ],
      });
    });

    it('should throw an exception if something goes wrong during insertion', async () => {
      jest
        .spyOn(accountRepo, 'insertOne')
        .mockRejectedValue(new Error('SOMETHING_WRONG'));

      jest.spyOn(accountRepo, 'exists').mockResolvedValue(false);

      await expect(
        accountService.createAccount(createAccountDto),
      ).rejects.toThrow(Error);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      username: 'test_user',
      password: 'test_password',
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully log in with valid credentials', async () => {
      jest.spyOn(accountRepo, 'findOne').mockResolvedValue({
        _id: '_id',
        displayName: 'displayName',
        avatar: 'avatar',
      });
      jest.spyOn(Hashing, 'compare').mockReturnValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('sync_token');

      const response = await accountService.login(loginDto);
      expect(accountRepo.findOne).toHaveBeenCalledTimes(1);
      expect(response.accessToken).toEqual('token_sign');
      expect(response.account._id).toEqual('_id');
      expect(response.account.displayName).toEqual('displayName');
      expect(response.account.avatar).toEqual('avatar');
    });

    it('should throw an exception if find account not found', async () => {
      jest.spyOn(accountRepo, 'findOne').mockReturnValue(null);
      await expect(accountService.login(loginDto)).rejects.toThrow();
      expect(accountRepo.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception if password mismatch', async () => {
      jest.spyOn(accountRepo, 'findOne').mockResolvedValue({
        _id: '_id',
        displayName: 'displayName',
        avatar: 'avatar',
        password: 'password',
      });
      jest.spyOn(Hashing, 'compare').mockReturnValue(false);

      await expect(accountService.login(loginDto)).rejects.toThrow();
      expect(accountRepo.findOne).toHaveBeenCalledTimes(1);
      expect(Hashing.compare).toHaveBeenCalledWith('test_password', 'password');
    });
  });
});

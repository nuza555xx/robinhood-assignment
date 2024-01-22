import { Inject, Injectable } from '@nestjs/common';
import { CreateAccountsDto, LoginDto } from './account.dto';
import { RepositoryProvider, Repository, Account } from '@repositories';
import { Hashing } from '@utils';
import { Exception } from '@exception';
import { ConfigProvider, JwtConfig } from '@configs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccountService {
  constructor(
    @Inject(RepositoryProvider.ACCOUNT)
    private readonly accountRepo: Repository<Account>,
    @Inject(ConfigProvider.JWT)
    private readonly jwtConfig: JwtConfig,
    private readonly jwtService: JwtService,
  ) {}

  private toAccountResponse({ _id, displayName, avatar }: Account) {
    return {
      _id,
      displayName,
      avatar,
    };
  }

  async createAccount(body: CreateAccountsDto) {
    await this.accountRepo.transaction(async () => {
      body.password = Hashing.hash(body.password);

      const exists = await this.accountRepo.exists({
        $or: [{ username: body.username }, { displayName: body.displayName }],
      });
      if (exists) throw new Exception('USERNAME_IS_EXIST');

      const inserted = await this.accountRepo.insertOne(body);
      if (!inserted) throw new Exception('SOMETHING_WRONG');
    });
  }

  async login(body: LoginDto) {
    const account = await this.accountRepo.findOne({
      username: body.username,
    });
    if (!account) throw new Exception('USERNAME_OR_PASSWORD_INVALID');

    const isMatch = Hashing.compare(body.password, account.password);
    if (!isMatch) throw new Exception('USERNAME_OR_PASSWORD_INVALID');

    const accessToken = await this.jwtService.signAsync(
      { id: account._id },
      {
        expiresIn: this.jwtConfig.accessTokenExpiresIn,
        secret: this.jwtConfig.secret,
      },
    );

    return {
      accessToken,
      account: this.toAccountResponse(account),
    };
  }
}

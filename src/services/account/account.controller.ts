import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountsDto, LoginDto } from './account.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@guards';
import { Authorize } from '@decorators';

@Authorize()
@ApiTags('accounts')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  @HttpCode(HttpStatus.NO_CONTENT)
  createAccount(@Body() body: CreateAccountsDto) {
    return this.accountService.createAccount(body);
  }

  @Public()
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.accountService.login(body);
  }
}

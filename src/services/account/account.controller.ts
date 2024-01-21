import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountsDto, LoginDto } from './account.dto';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@guards';
import { Authorize } from '@decorators';
import { LoginResponse } from './account.entitiy';
import { ErrorsCode } from '@exception';

@Authorize()
@ApiTags('accounts')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorsCode['USERNAME_IS_EXIST'].message,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ErrorsCode['MISSING_AUTHORIZATION_HEADERS'].message,
  })
  @Post('create')
  @HttpCode(HttpStatus.NO_CONTENT)
  createAccount(@Body() body: CreateAccountsDto) {
    return this.accountService.createAccount(body);
  }

  @Public()
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorsCode['USERNAME_OR_PASSWORD_INVALID'].message,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorsCode['USERNAME_OR_PASSWORD_INVALID'].message,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: LoginResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorsCode['RATE_LIMIT_REQUEST'].message,
  })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.accountService.login(body);
  }
}

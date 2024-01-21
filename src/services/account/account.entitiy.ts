import { ApiProperty } from '@nestjs/swagger';

export class AccountResponse {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  avatar: string;
}

export class LoginResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: AccountResponse })
  account: AccountResponse;
}

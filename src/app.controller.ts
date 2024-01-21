import { Public } from '@guards';
import { IgnoreResponse } from '@interceptor';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('health')
@Controller('health')
export class AppController {
  constructor() {}

  @Get()
  @Public()
  @SkipThrottle()
  @IgnoreResponse()
  healthCheck(): boolean {
    return true;
  }
}

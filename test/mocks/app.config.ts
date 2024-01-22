import { AppModule } from '@app/module';
import { AuthGuard } from '@guards';
import { ResponseInterceptor } from '@interceptor';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { TestingModule, Test } from '@nestjs/testing';

export async function createTestApp(): Promise<NestFastifyApplication> {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ResponseInterceptor)
    .useValue({}) // Mock the ResponseInterceptor provider
    .overrideProvider(AuthGuard)
    .useValue({}) // Mock the AuthGuard provider
    .compile();

  const app = moduleRef.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );

  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return app;
}

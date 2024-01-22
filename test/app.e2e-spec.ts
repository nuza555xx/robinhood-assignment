import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createTestApp } from './mocks/app.config';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`/GET health`, () => {
    return app
      .inject({
        method: 'GET',
        url: '/health',
      })
      .then((result) => {
        expect(result.statusCode).toEqual(200);
        expect(result.payload).toBeTruthy();
      });
  });
});

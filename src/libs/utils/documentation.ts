import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

export class Documentation {
  static setup(
    title: string,
    desc: string,
    path: string,
    app: NestFastifyApplication,
    environment: string,
    version: string,
  ): void {
    const documentConfig = new DocumentBuilder()
      .setTitle(title)
      .setDescription(desc)
      .setVersion(version)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JSON Web Token',
          description: 'Enter JSON Web Token',
          in: 'header',
        },
        'JSON Web Token Authorization',
      )
      .build();

    const document = SwaggerModule.createDocument(app, documentConfig);
    SwaggerModule.setup(path, app, document);

    if (environment === 'development')
      writeFileSync(
        `${process.cwd()}/${title
          .toLowerCase()
          .replace(/\s/, '-')}-swagger.json`,
        JSON.stringify(document, null, 2),
        'utf8',
      );
  }
}

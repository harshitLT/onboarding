require('dotenv').config({ path: `../.env` });

// external
const projectName = process.env.npm_package_name || 'onboarding';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {ConfigService} from '@nestjs/config';

// modules
import { AppModule } from './app.module';

// interceptors
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const jwtService = app.get(JwtService);
  // app.use(jwtService);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));
  app.enableShutdownHooks();
  const configService = app.get(ConfigService);
  const port = configService.get('PORT')
  await app.listen(port);
  console.log(`App is listening on port ${port}`)
}

bootstrap();

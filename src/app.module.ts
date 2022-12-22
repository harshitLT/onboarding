import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { AuthModule } from './modules/auth/v1/auth.module';
import { UserModule } from './modules/user/v1/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: Joi.object({
      PORT: Joi.number().required(),
      npm_package_name: Joi.string().required(),
      MONGODB_URL: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      JWT_ACCESS_EXPIRATION_MINUTES: Joi.string().required(),
      JWT_REFRESH_EXPIRATION_DAYS: Joi.string().required(),
    }) }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
          uri: await configService.get('MONGODB_URL'),
        }),
        inject: [ConfigService],
  }),
  AuthModule,
  UserModule,
  ],
})
export class AppModule {}

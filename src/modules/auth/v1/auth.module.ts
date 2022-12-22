import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './../schemas/token.schema';
import { Logger } from '@nestjs/common';
import { LocalStrategy } from '../../../gurads/localAuthentication/local.strategy';
import { UserModule } from 'src/modules/user/v1/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/gurads/jwt/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Token.name,
        schema: TokenSchema,
      },
    ]),
    PassportModule,
    UserModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, Logger, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}

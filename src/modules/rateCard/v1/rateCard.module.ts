import { Module } from '@nestjs/common';
import { RateCardController } from './rateCard.controller';
import { RateCardService } from './rateCard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RateCard, RateCardSchema } from '../schemas/rateCard.schema';
import { Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/gurads/jwt/jwt.strategy';
import { UserModule } from 'src/modules/user/v1/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RateCard.name,
        schema: RateCardSchema,
      },
    ]),
    JwtModule,
    UserModule,
  ],
  controllers: [RateCardController],
  providers: [RateCardService, Logger, JwtStrategy],
  exports: [RateCardService],
})
export class RateCardModule {}

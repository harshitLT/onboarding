import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/gurads/jwt/jwt.strategy';
import { RateCardModule } from 'src/modules/rateCard/v1/rateCard.module';
import { POD, PODSchema } from '../schemas/pod.schema';
import {
  PaymentRequest,
  PaymentRequestSchema,
} from '../schemas/paymentRequest.schema';
import { TripModule } from 'src/modules/trip/v1/trip.module';
import { UserModule } from 'src/modules/user/v1/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: POD.name,
        schema: PODSchema,
      },
      {
        name: PaymentRequest.name,
        schema: PaymentRequestSchema,
      },
    ]),
    JwtModule,
    TripModule,
    RateCardModule,
    UserModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, Logger, JwtStrategy],
  exports: [PaymentService],
})
export class PaymentModule {}

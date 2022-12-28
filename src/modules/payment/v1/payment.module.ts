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
import { BullModule } from '@nestjs/bull';
import { PaymentProcessor } from './payment.processor';
import { Ledger, LedgerSchema } from '../schemas/ledger.schema';
import { PaymentGateway } from './payment.gateway';

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
      {
        name: Ledger.name,
        schema: LedgerSchema,
      },
    ]),
    JwtModule,
    TripModule,
    RateCardModule,
    UserModule,
    BullModule.registerQueue({
      name: 'payments-queue',
    }),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    Logger,
    JwtStrategy,
    PaymentProcessor,
    PaymentGateway,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}

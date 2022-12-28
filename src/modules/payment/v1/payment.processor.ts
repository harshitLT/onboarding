import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { TripService } from 'src/modules/trip/v1/trip.service';
import { LedgerType } from '../enum/ledgerType.enum';
import { PaymentRequestStatus } from '../enum/paymentRequest.enum';
import { Ledger, LedgerDocument } from '../schemas/ledger.schema';
import {
  PaymentRequest,
  PaymentRequestDocument,
} from '../schemas/paymentRequest.schema';

@Processor('payments-queue')
export class PaymentProcessor {
  constructor(
    @InjectModel(Ledger.name)
    private ledgerModel: Model<LedgerDocument>,
    @InjectModel(PaymentRequest.name)
    private paymentRequest: Model<PaymentRequestDocument>,
    private readonly configService: ConfigService,
    private readonly tripService: TripService,
  ) {}

  @Process()
  async processPayments(job: Job) {
    try {
      const process = Boolean(this.configService.get('PROCESS_PAYMENTS'));
      const paymentRequest: PaymentRequestDocument = job.data;
      const totalAmount =
        paymentRequest.tripAmount +
        paymentRequest.incentive -
        paymentRequest.penalty;
      await this.paymentRequest.updateOne(
        { _id: paymentRequest._id },
        {
          status: process
            ? PaymentRequestStatus.SUCCESS
            : PaymentRequestStatus.FAILED,
        },
      );
      if (process) {
        const trip = await this.tripService.getById(paymentRequest.tripId);
        const doc: Ledger = {
          userId: trip.assignedTo,
          amount: totalAmount,
          status: totalAmount > 0 ? LedgerType.CREDIT : LedgerType.DEBIT,
        };
        const ledger = await this.ledgerModel.create(doc);
        await ledger.save();
      }
    } catch (error) {
      console.log(error);
    }
  }
}

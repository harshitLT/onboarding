import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PaymentRequestStatus } from '../enum/paymentRequest.enum';

export type PaymentRequestDocument = PaymentRequest & Document;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'processedAt',
  },
})
export class PaymentRequest {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  tripId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  tripAmount: number;

  @Prop({ required: true })
  incentive: number;

  @Prop({ required: true })
  penalty: number;

  @Prop({ default: PaymentRequestStatus.CREATED, enum: PaymentRequestStatus })
  status?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  processedAt?: Date;
}

const PaymentRequestSchema = SchemaFactory.createForClass(PaymentRequest);
export { PaymentRequestSchema };

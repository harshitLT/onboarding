import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LedgerType } from '../enum/ledgerType.enum';

export type LedgerDocument = Ledger & Document;

@Schema({
  timestamps: {
    createdAt: 'date',
  },
})
export class Ledger {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: LedgerType })
  status: string;

  @Prop()
  date?: Date;
}

const LedgerSchema = SchemaFactory.createForClass(Ledger);
export { LedgerSchema };

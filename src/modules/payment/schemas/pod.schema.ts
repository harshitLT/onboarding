import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PODStatus } from '../enum/podStatus.enum';

export type PODDocument = POD & Document;

@Schema({
  timestamps: {
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
  },
})
export class POD {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  tripId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  pod: string;

  @Prop({ default: PODStatus.CREATED, enum: PODStatus })
  status?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

const PODSchema = SchemaFactory.createForClass(POD);
export { PODSchema };

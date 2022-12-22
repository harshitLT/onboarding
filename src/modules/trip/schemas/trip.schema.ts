import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TripStatus } from '../enum/tripStatus.enum';

export type TripDocument = Trip & Document;

@Schema({
  timestamps: {
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  },
})
export class Trip {
  @Prop({ default: TripStatus.CREATED, enum: TripStatus })
  status?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users' })
  assignedTo?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'rateCards' })
  rateCard?: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date, required: true })
  startTime: Date;

  @Prop({ type: Date })
  actualStartTime?: Date;

  @Prop({ type: Number, required: true })
  totalKms: number;

  @Prop({ type: Number })
  actualKms?: number;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

const TripSchema = SchemaFactory.createForClass(Trip);
export { TripSchema };

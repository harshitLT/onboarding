import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PODDocument = POD & Document;

@Schema({
  timestamps: {
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  },
})
export class POD {
  @Prop()
  name?: string;

  @Prop()
  description?: string;

  @Prop({ type: MongooseSchema.Types.Buffer, required: true })
  image: Buffer;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

const PODSchema = SchemaFactory.createForClass(POD);
export { PODSchema };

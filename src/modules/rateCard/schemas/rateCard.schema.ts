import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type RateCardDocument = RateCard & Document;

@Schema({})
export class RateCard {
  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  penalty: number;

  @Prop({ type: Number, required: true })
  incentive: number;
}

const RateCardSchema = SchemaFactory.createForClass(RateCard);
export { RateCardSchema };

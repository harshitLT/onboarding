import { IsDate, IsString } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class PODDetailsDTO {
  @IsString()
  _id: string;

  @IsString()
  tripId: MongooseSchema.Types.ObjectId;

  @IsString()
  pod: string;

  @IsString()
  status?: string;

  @IsDate()
  createdAt?: Date;

  @IsDate()
  updatedAt?: Date;
}

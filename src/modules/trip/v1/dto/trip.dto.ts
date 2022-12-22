import {
  IsString,
  IsPhoneNumber,
  IsEnum,
  IsDate,
  IsNumber,
} from 'class-validator';

export class TripDTO {
  @IsString()
  assignedTo?: string;

  @IsString()
  rateCard?: string;

  @IsDate()
  startTime: Date;

  @IsDate()
  actualStartTime?: Date;

  @IsNumber()
  totalKms: number;

  @IsNumber()
  actualKms?: number;
}

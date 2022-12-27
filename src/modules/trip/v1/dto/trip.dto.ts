import { IsString, IsNumber, IsDateString } from 'class-validator';

export class TripDTO {
  @IsString()
  assignedTo?: string;

  @IsString()
  rateCard?: string;

  @IsDateString()
  startTime: Date;

  @IsNumber()
  totalKms: number;
}

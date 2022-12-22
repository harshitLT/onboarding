import { IsString, IsDate, IsNumber } from 'class-validator';

export class TripDTO {
  @IsString()
  assignedTo?: string;

  @IsString()
  rateCard?: string;

  @IsDate()
  startTime: Date;

  @IsNumber()
  totalKms: number;
}

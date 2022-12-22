import { IsNumber, IsString } from 'class-validator';

export class RateCardDetailsDTO {
  @IsString()
  _id: string;

  @IsNumber()
  price: number;

  @IsNumber()
  penalty?: number;

  @IsNumber()
  incentive?: number;
}

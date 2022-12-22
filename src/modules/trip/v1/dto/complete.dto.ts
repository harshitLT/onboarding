import { IsNumber } from 'class-validator';

export class CompleteDTO {
  @IsNumber()
  actualKms: number;
}

import { IsString } from 'class-validator';

export class AttachDTO {
  @IsString()
  rateCardId: string;
}

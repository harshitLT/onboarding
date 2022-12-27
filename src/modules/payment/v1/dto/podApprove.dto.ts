import { IsNumber, Min, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class PODApproveDTO {
  @Type(() => Boolean)
  @IsBoolean()
  isApproved: boolean;
}

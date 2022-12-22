import { IsString } from 'class-validator';

export class AssignDTO {
  @IsString()
  driverId: string;
}

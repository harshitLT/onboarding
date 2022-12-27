import { IsString } from 'class-validator';

export class PODUploadDTO {
  @IsString()
  file: string;
}

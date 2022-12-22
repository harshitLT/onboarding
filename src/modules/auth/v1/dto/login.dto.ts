import { IsString, IsPhoneNumber } from 'class-validator';

export class LoginDTO {
  @IsPhoneNumber()
  phone: string;

  @IsString()
  password: string;
}

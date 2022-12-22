import { IsString, IsPhoneNumber, IsEnum } from 'class-validator';
import { Roles } from '../../../../gurads/roles/enum/role.enum';

export class UserDTO {
  @IsPhoneNumber()
  phone: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsEnum(Roles)
  role: string;
}

import { IsString, IsPhoneNumber, IsEnum, IsBoolean } from "class-validator";
import { Roles } from '../../../../gurads/roles/enum/role.enum';

export class UserDetailsDTO {
	@IsPhoneNumber()
	phone: string;

	@IsString()
	password: string;

	@IsString()
	name: string;

	@IsEnum(Roles)
	role: string;

	@IsString()
	_id: string;

	@IsBoolean()
	active: boolean;
}
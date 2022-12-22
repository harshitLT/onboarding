import { IsString } from "class-validator";

export class RefreshDTO {
	@IsString()
	token: string;
}
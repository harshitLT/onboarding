import { IsString } from "class-validator";

export class RefreshHeadersDTO {
	@IsString()
	authorization: string;
}
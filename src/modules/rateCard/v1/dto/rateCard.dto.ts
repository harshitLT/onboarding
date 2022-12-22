import { IsNumber } from "class-validator";

export class RateCardDTO {
	@IsNumber()
	price: number;

	@IsNumber()
	penalty?: number;

	@IsNumber()
	incentive?: number;
}
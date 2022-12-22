import { IsString, IsEnum, IsDate, IsNumber } from "class-validator";
import { TripStatus } from "../../enum/tripStatus.enum";
import { Schema as MongooseSchema } from 'mongoose';

export class TripDetailsDTO {
	@IsString()
	_id: string;

	@IsEnum(TripStatus)
	status?: string;

	@IsString()
	assignedTo?: MongooseSchema.Types.ObjectId;

	@IsString()
	rateCard?: MongooseSchema.Types.ObjectId;

	@IsDate()
	createdAt?: Date;

	@IsDate()
	updatedAt?: Date;

	@IsDate()
	startTime: Date;

	@IsDate()
	actualStartTime?: Date;

	@IsNumber()
	totalKms: number;

	@IsNumber()
	actualKms?: number;
}
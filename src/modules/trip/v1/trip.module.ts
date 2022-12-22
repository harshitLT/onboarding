import { Module } from "@nestjs/common";
import { TripController } from './trip.controller';
import { TripService } from "./trip.service";
import { MongooseModule } from '@nestjs/mongoose';
import { Trip, TripSchema } from '../schemas/trip.schema';
import { Logger } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "src/gurads/jwt/jwt.strategy";
import { UserModule } from "src/modules/user/v1/user.module";
import { RateCardModule } from "src/modules/rateCard/v1/rateCard.module";

@Module({
	imports: [MongooseModule.forFeature([{
		name: Trip.name,
		schema: TripSchema,
	}]),
	JwtModule,
	UserModule,
	RateCardModule
	],
	controllers: [TripController],
	providers: [TripService, Logger, JwtStrategy],
	exports : [TripService]
})
export class TripModule {}
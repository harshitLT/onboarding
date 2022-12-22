import {
  Controller,
  Get,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Patch,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { TripDTO } from './dto/trip.dto';
import { TripDetailsDTO } from './dto/tripDetails.dto';
import { Logger } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/gurads/jwt/jwtAuthentication.guard';
import RoleGuard from 'src/gurads/roles/role.guard';
import { Roles } from 'src/gurads/roles/enum/role.enum';

@Controller({
  version: '1',
  path: 'trips',
})
export class TripController {
  constructor(
    private readonly TripService: TripService,
    private readonly logger: Logger,
  ) {}

  @UseGuards(RoleGuard(Roles.ADMIN))
  @Post('create')
  async create(@Body() tripDTO: TripDTO): Promise<TripDetailsDTO> {
    try {
      return this.TripService.create(tripDTO);
    } catch (err) {
      this.logger.error(`Error while creating trip: ${JSON.stringify(err)}`);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

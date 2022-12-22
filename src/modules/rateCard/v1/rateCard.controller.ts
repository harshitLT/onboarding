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
import { RateCardService } from './rateCard.service';
import { RateCardDTO } from './dto/rateCard.dto';
import { RateCardDetailsDTO } from './dto/rateCardDetails.dto';
import { Logger } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/gurads/jwt/jwtAuthentication.guard';
import RoleGuard from 'src/gurads/roles/role.guard';
import { Roles } from 'src/gurads/roles/enum/role.enum';
import { Helper } from 'src/utils/helpers';

@Controller({
  version: '1',
  path: 'rateCards',
})
export class RateCardController {
  constructor(
    private readonly RateCardService: RateCardService,
    private readonly logger: Logger,
  ) {}

  @UseGuards(RoleGuard(Roles.ADMIN))
  @Post('create')
  async create(@Body() rateCardDTO: RateCardDTO): Promise<RateCardDetailsDTO> {
    try {
      return this.RateCardService.create(rateCardDTO);
    } catch (err) {
      this.logger.error(
        `Error while creating rateCard: ${JSON.stringify(err)}`,
      );
      Helper.errorHelper(err);
    }
  }
}

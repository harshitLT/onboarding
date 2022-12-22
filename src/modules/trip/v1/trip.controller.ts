import {
  Controller,
  Get,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Patch,
  Req,
  HttpCode,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TripService } from './trip.service';
import {
  TripDTO,
  TripDetailsDTO,
  AttachDTO,
  AssignDTO,
  CompleteDTO,
} from './dto/index.dto';
import { Logger } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/gurads/jwt/jwtAuthentication.guard';
import RoleGuard from 'src/gurads/roles/role.guard';
import { Roles } from 'src/gurads/roles/enum/role.enum';
import { Helper } from 'src/utils/helpers';
import RequestWithUser from 'src/modules/auth/interfaces/auth.requestWithUser.interface';
import { FileInterceptor } from '@nestjs/platform-express';

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
      Helper.errorHelper(err);
    }
  }

  @UseGuards(RoleGuard(Roles.ADMIN))
  @HttpCode(200)
  @Post('attach-rate-card/:id')
  async attachRateCard(@Body() attachDTO: AttachDTO, @Param('id') id: string) {
    try {
      const { rateCardId } = attachDTO;
      return this.TripService.attach(rateCardId, id);
    } catch (err) {
      this.logger.error(
        `Error while attaching rate card to trip: ${JSON.stringify(err)}`,
      );
      Helper.errorHelper(err);
    }
  }

  @UseGuards(RoleGuard(Roles.ADMIN))
  @Post('assign-driver/:id')
  async assign(@Body() assignDTO: AssignDTO, @Param('id') id: string) {
    try {
      const { driverId } = assignDTO;
      return this.TripService.assign(driverId, id);
    } catch (err) {
      this.logger.error(`Error while assigning trip: ${JSON.stringify(err)}`);
      Helper.errorHelper(err);
    }
  }

  @UseGuards(RoleGuard(Roles.DRIVER))
  @Post('start/:id')
  async start(@Req() request: RequestWithUser, @Param('id') id: string) {
    try {
      return this.TripService.start(request.user, id);
    } catch (err) {
      this.logger.error(`Error while starting trip: ${JSON.stringify(err)}`);
      Helper.errorHelper(err);
    }
  }

  @UseGuards(RoleGuard(Roles.DRIVER))
  @Post('complete/:id')
  async end(
    @Body() completeDTO: CompleteDTO,
    @Req() request: RequestWithUser,
    @Param('id') id: string,
  ) {
    try {
      const { actualKms } = completeDTO;
      return this.TripService.complete(request.user, id, actualKms);
    } catch (err) {
      this.logger.error(`Error while creating trip: ${JSON.stringify(err)}`);
      Helper.errorHelper(err);
    }
  }

  @Post('upload-pod/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return this.TripService.uploadPOD(request.user, file, id);
    } catch (err) {
      this.logger.error(`Error while creating trip: ${JSON.stringify(err)}`);
      Helper.errorHelper(err);
    }
  }
}

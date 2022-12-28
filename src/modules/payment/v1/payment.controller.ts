import {
  Controller,
  Param,
  Post,
  Req,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Query,
  HttpCode,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Logger } from '@nestjs/common';
import RoleGuard from 'src/gurads/roles/role.guard';
import { Roles } from 'src/gurads/roles/enum/role.enum';
import { Helper } from 'src/utils/helpers';
import RequestWithUser from 'src/modules/auth/interfaces/auth.requestWithUser.interface';
import { PODUploadDTO } from './dto/podUpload.dto';
import { PaginationParams } from '../../../utils/paginationParams.dto';
import { PODApproveDTO } from './dto/podApprove.dto';

@Controller({
  version: '1',
  path: 'payments',
})
export class PaymentController {
  constructor(
    private readonly PaymentService: PaymentService,
    private readonly logger: Logger,
  ) {}

  @UseGuards(RoleGuard(Roles.DRIVER))
  @Post('pod/upload/:tripId')
  async create(
    @Req() request: RequestWithUser,
    @Param('tripId') tripId: string,
    @Body() podUploadDTO: PODUploadDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const { file } = podUploadDTO;
      return this.PaymentService.create(request.user, file, tripId);
    } catch (err) {
      this.logger.error(
        `Error while creating proof of delivery: ${JSON.stringify(err)}`,
      );
      Helper.errorHelper(err);
    }
  }

  @UseGuards(RoleGuard(Roles.PAYMENT_EXEC))
  @HttpCode(200)
  @Post('pod/approve-reject/:podId')
  async approveReject(
    @Param('podId') podId: string,
    @Body() podApproveDTO: PODApproveDTO,
  ) {
    try {
      const { isApproved } = podApproveDTO;
      return this.PaymentService.approveRejectPOD(isApproved, podId);
    } catch (err) {
      this.logger.error(
        `Error while updating proof of delivery: ${JSON.stringify(err)}`,
      );
      Helper.errorHelper(err);
    }
  }

  @UseGuards(RoleGuard(Roles.PAYMENT_EXEC))
  @HttpCode(200)
  @Get()
  async get(@Query() { page, pageSize }: PaginationParams) {
    try {
      return this.PaymentService.get(page, pageSize);
    } catch (err) {
      this.logger.error(
        `Error while fetching payment requests: ${JSON.stringify(err)}`,
      );
      Helper.errorHelper(err);
    }
  }

  @UseGuards(RoleGuard(Roles.PAYMENT_EXEC))
  @HttpCode(200)
  @Get('pod')
  async getPOD(@Query() { page, pageSize }: PaginationParams) {
    try {
      return this.PaymentService.getPOD(page, pageSize);
    } catch (err) {
      this.logger.error(
        `Error while fetching proof of delivery: ${JSON.stringify(err)}`,
      );
      Helper.errorHelper(err);
    }
  }
}

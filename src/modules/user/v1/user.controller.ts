import {
  Controller,
  Get,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Post,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { UserDetailsDTO } from './dto/userDetails.dto';
import { Logger } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/gurads/jwt/jwtAuthentication.guard';
import RoleGuard from 'src/gurads/roles/role.guard';
import { Roles } from 'src/gurads/roles/enum/role.enum';

@Controller({
  version: '1',
  path: 'users',
})
export class UserController {
  constructor(
    private readonly UserService: UserService,
    private readonly logger: Logger,
  ) {}

  @UseGuards(RoleGuard(Roles.ADMIN))
  @Post('create')
  async create(@Body() loginDTO: UserDTO): Promise<UserDetailsDTO> {
    try {
      return this.UserService.create(loginDTO);
    } catch (err) {
      this.logger.error(`Error while creating user: ${JSON.stringify(err)}`);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

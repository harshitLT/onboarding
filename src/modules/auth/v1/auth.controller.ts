import {
  Controller,
  Headers,
  Body,
  HttpException,
  HttpStatus,
  Post,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { Logger } from '@nestjs/common';
import { LocalAuthenticationGuard } from '../../../gurads/localAuthentication/localAuthentication.guard';
import RequestWithUser from '../interfaces/auth.requestWithUser.interface';
import JwtAuthenticationGuard from 'src/gurads/jwt/jwtAuthentication.guard';
import { RefreshDTO } from './dto/refresh.dto';
import { RefreshHeadersDTO } from './dto/refreshHeaders.dto';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(
    private readonly AuthService: AuthService,
    private readonly logger: Logger,
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser, @Body() loginDTO: LoginDTO) {
    try {
      return this.AuthService.login(request.user);
    } catch (err) {
      this.logger.error(`Error while login: ${JSON.stringify(err)}`);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logout(@Req() request: RequestWithUser) {
    try {
      return this.AuthService.logout(request.user);
    } catch (err) {
      this.logger.error(`Error while login: ${JSON.stringify(err)}`);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @HttpCode(200)
  @Post('refresh')
  async refresh(
    @Headers() headers: RefreshHeadersDTO,
    @Body() body: RefreshDTO,
  ) {
    try {
      return this.AuthService.refresh(headers.authorization, body.token);
    } catch (err) {
      this.logger.error(`Error while login: ${JSON.stringify(err)}`);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

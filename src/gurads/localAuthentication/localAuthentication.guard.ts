import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import RequestWithUser from 'src/modules/auth/interfaces/auth.requestWithUser.interface';
import { LoginDTO } from 'src/modules/auth/v1/dto/login.dto';

@Injectable()
export class LocalAuthenticationGuard extends AuthGuard('local') {}

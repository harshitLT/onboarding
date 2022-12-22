import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../modules/auth/v1/auth.service';
import { User } from '../../modules/user/schemas/user.schema';
 
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthService) {
    super({
      usernameField: 'phone'
    });
  }
  async validate(phone: string, password: string): Promise<User> {
    return this.authenticationService.getAuthenticatedUser(phone, password);
  }
}
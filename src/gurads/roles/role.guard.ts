import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import RequestWithUser from 'src/modules/auth/interfaces/auth.requestWithUser.interface';
import JwtAuthenticationGuard from '../jwt/jwtAuthentication.guard';
import { Roles } from './enum/role.enum';

const RoleGuard = (role: Roles): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return user?.role === role;
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;

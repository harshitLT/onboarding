import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { UserService } from '../../modules/user/v1/user.service';
import { TokenType } from 'src/modules/auth/enum/tokenTypes';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET')
        });
    }

    async validate(payload: TokenPayload) {
        try {
            if(payload.type!=TokenType.ACCESS){
                throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
            }
            if (moment().isAfter(moment.unix(payload.exp))) {
                throw new HttpException('Token Expired', HttpStatus.UNAUTHORIZED);
            }
            const user = this.userService.getById(payload.userId);
            return user;
        } catch (error) {
            throw error;
        }
    }
}
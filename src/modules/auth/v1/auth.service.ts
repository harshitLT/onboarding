import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { Token, TokenDocument } from './../schemas/token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { UserService } from 'src/modules/user/v1/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/modules/user/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { TokenType } from '../enum/tokenTypes';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) { }

  public async getAuthenticatedUser(phone: string, plainTextPassword: string) {
    try {
      const user = await this.userService.getByPhone(phone);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Login
   * @param {UserDocument} user
   * @returns {Promise<object>}
   */
  public async login(user: UserDocument): Promise<object> {
    try {
      if (await this.tokenModel.findOne({userId:user._id})){
        throw new HttpException('Please logout of existing application to continue', HttpStatus.BAD_REQUEST);
      }
      const tokenData: object = await this.generateAuthTokens(user);
      await user.update({active: true});
      return tokenData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logout
   * @param {UserDocument} user
   * @returns {Promise<object>}
   */
  public async logout(user: UserDocument): Promise<object> {
    try {
      await this.tokenModel.findOneAndRemove({userId:user._id});
      await user.update({active: false});
      return {};
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refresh
   * @param {UserDocument} user
   * @returns {Promise<object>}
   */
  public async refresh(bearerToken: string, refreshToken: string): Promise<object>{
    try {
      bearerToken = bearerToken.replace('Bearer', '').trim();
      const { userId, exp } = this.jwtService.decode(bearerToken) as { [key: string]: any; };
      const user = await this.userService.getById(userId);
      const storedRefreshToken = await this.tokenModel.findOne({userId});
      if(storedRefreshToken.token===refreshToken && moment().isBefore(moment.unix(exp))){
        return await this.generateAuthTokens(user);
      }
      throw new HttpException('Invalid refresh token', HttpStatus.FORBIDDEN);
    } catch (error) {
      throw error;
    }
  }

  /**
 * Generate auth tokens
 * @param {UserDocument} user
 * @returns {Promise<object>}
 */
  private async generateAuthTokens(user: UserDocument): Promise<object> {
    const currentDate: Date = new Date();
    const accessTokenExpires = this.configService.get('JWT_ACCESS_EXPIRATION_MINUTES') * 60;
    const accessToken = this.jwtService.sign({ userId: user._id, type: TokenType.ACCESS }, {
      expiresIn: accessTokenExpires,
      secret: this.configService.get('JWT_SECRET'),
    });
    const refreshTokenExpires = this.configService.get('JWT_REFRESH_EXPIRATION_DAYS') * 24 * 60 * 60;
    const refreshToken = this.jwtService.sign({ userId: user._id, type: TokenType.REFRESH }, {
      expiresIn: refreshTokenExpires,
      secret: this.configService.get('JWT_SECRET'),
    });

    const doc: Token = {
      token: refreshToken,
      userId: user._id,
    };

    const createdToken = new this.tokenModel(doc);

    return createdToken.save().then((_) => {
      return {
        accessToken,
        refreshToken,
      };
    }).catch((e) => {
      throw e;
    });
  };

  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }
}

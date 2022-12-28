import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserDetailsDTO } from './dto/userDetails.dto';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getByPhone(phone: string): Promise<User> {
    const user = await this.userModel.findOne({ phone });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this phone does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserFromSocket(socket: Socket) {
    try {
      const token = socket.handshake.headers.authorization.replace(
        'Bearer ',
        '',
      );
      let user: UserDocument;
      const payload: TokenPayload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      if (payload.userId) {
        return this.getById(payload.userId);
      }
      if (!user) {
        throw new WsException('Invalid credentials.');
      }
      return user;
    } catch (error) {
      console.log(error);
      throw new WsException('Invalid credentials.');
    }
  }

  async getById(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  /**
   * This method is used for creating nps event
   * @param {UserDTO} userDTO
   * @return {Promise}
   */
  async create(userDTO: UserDTO): Promise<UserDetailsDTO> {
    try {
      const user = await this.userModel.findOne({ phone: userDTO.phone });
      if (user) {
        throw new HttpException(
          'User with this phone already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hash = await bcrypt.hash(userDTO.password, 10);

      const doc: User = {
        name: userDTO.name,
        password: hash,
        role: userDTO.role,
        phone: userDTO.phone,
      };

      const createdUser = new this.userModel(doc);

      return createdUser.save();
    } catch (error) {
      throw error;
    }
  }
}

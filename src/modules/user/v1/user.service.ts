import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserDetailsDTO } from './dto/userDetails.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly logger: Logger,
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

  async getById(id: string) {
    const user = await this.userModel.findOne({ _id: id, active: true });
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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RateCard, RateCardDocument } from '../schemas/rateCard.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { RateCardDTO } from './dto/rateCard.dto';
import { RateCardDetailsDTO } from './dto/rateCardDetails.dto';
import { UserService } from 'src/modules/user/v1/user.service';

@Injectable()
export class RateCardService {
  constructor(
    @InjectModel(RateCard.name)
    private rateCardModel: Model<RateCardDocument>,
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  async getById(id: string) {
    const rateCard = await this.rateCardModel.findOne({ _id: id });
    if (rateCard) {
      return rateCard;
    }
    throw new HttpException(
      'RateCard with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  /**
   * This method is used for creating nps event
   * @param {RateCardDTO} rateCardDTO
   * @return {Promise}
   */
  async create(rateCardDTO: RateCardDTO): Promise<RateCardDetailsDTO> {
    try {
      const createdRateCard = new this.rateCardModel(rateCardDTO);
      return createdRateCard.save();
    } catch (error) {
      throw error;
    }
  }
}

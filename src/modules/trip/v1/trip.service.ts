import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Trip, TripDocument } from '../schemas/trip.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { TripDTO } from './dto/trip.dto';
import { TripDetailsDTO } from './dto/tripDetails.dto';
import { UserService } from 'src/modules/user/v1/user.service';
import { RateCardService } from 'src/modules/rateCard/v1/rateCard.service';

@Injectable()
export class TripService {
  constructor(
    @InjectModel(Trip.name)
    private tripModel: Model<TripDocument>,
    private readonly userService: UserService,
    private readonly rateCardService: RateCardService,
    private readonly logger: Logger,
  ) { }

  async getById(id: string) {
    const trip = await this.tripModel.findOne({ _id: id });
    if (trip) {
      return trip;
    }
    throw new HttpException('Trip with this id does not exist', HttpStatus.NOT_FOUND);
  }

  /**
   * This method is used for creating nps event
   * @param {TripDTO} tripDTO
   * @return {Promise}
   */
  async create(
    tripDTO: TripDTO,
  ): Promise<TripDetailsDTO> {
    const {assignedTo, rateCard} = tripDTO;
    let assignedToId: MongooseSchema.Types.ObjectId;
    let rateCardId: MongooseSchema.Types.ObjectId;
    if(assignedTo){
      const user = await this.userService.getById(assignedTo);
      assignedToId = user._id;
    }
    if(rateCard){
      const rateCardObject = await this.rateCardService.getById(rateCard);
      rateCardId = rateCardObject._id;
    }
    const doc: Trip = {
      ...tripDTO,
      assignedTo: assignedToId,
      rateCard: rateCardId,
    }

    const createdTrip = new this.tripModel(doc);

    return createdTrip.save();
  }
}

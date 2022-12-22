import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Trip, TripDocument } from '../schemas/trip.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { TripDTO, TripDetailsDTO } from './dto/index.dto';
import { UserService } from 'src/modules/user/v1/user.service';
import { RateCardService } from 'src/modules/rateCard/v1/rateCard.service';
import { TripStatus } from '../enum/tripStatus.enum';
import { Roles } from 'src/gurads/roles/enum/role.enum';
import { UserDocument } from 'src/modules/user/schemas/user.schema';

@Injectable()
export class TripService {
  constructor(
    @InjectModel(Trip.name)
    private tripModel: Model<TripDocument>,
    private readonly userService: UserService,
    private readonly rateCardService: RateCardService,
    private readonly logger: Logger,
  ) {}

  async getById(id: string) {
    const trip = await this.tripModel.findOne({ _id: id });
    if (trip) {
      return trip;
    }
    throw new HttpException(
      'Trip with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  /**
   * This method is used for attaching trip to rate card
   * @param {string} rateCardId
   * @param {string} tripId
   */
  async attach(rateCardId: string, tripId: string) {
    try {
      const trip = await this.getById(tripId);
      if (trip.status != TripStatus.CREATED) {
        throw new HttpException(
          'Cannot attach rate card as trip is not in created state anymore',
          HttpStatus.BAD_REQUEST,
        );
      }
      const rateId = (await this.rateCardService.getById(rateCardId))._id;
      await trip.update({ rateCard: rateId });
    } catch (error) {
      throw error;
    }
  }

  /**
   * This method is used for assigning driver to trip
   * @param {string} driverId
   * @param {string} tripId
   */
  async assign(driverId: string, tripId: string) {
    try {
      const trip = await this.getById(tripId);
      if (trip.status != TripStatus.CREATED) {
        throw new HttpException(
          'Driver to this trip is already assigned.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.userService.getById(driverId);
      if (user.role != Roles.DRIVER) {
        throw new HttpException(
          'The user id provided does not belong to a driver',
          HttpStatus.BAD_REQUEST,
        );
      }
      await trip.update({ assignTo: user._id, status: TripStatus.ASSIGNED });
    } catch (error) {
      throw error;
    }
  }

  /**
   * This method is used for starting the trip
   * @param {string} tripId
   * @param {UserDocument} user
   */
  async start(user: UserDocument, tripId: string) {
    try {
      const trip = await this.getById(tripId);
      if (trip.status != TripStatus.ASSIGNED) {
        throw new HttpException(
          trip.status == TripStatus.CREATED
            ? 'Driver not yet assigned'
            : `Driver to this trip is already ${trip.status}.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (trip.assignedTo != user._id) {
        throw new HttpException(
          'This trip is not assigned to you.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await trip.update({
        status: TripStatus.IN_PROGRESS,
        actualStartTime: moment().toDate,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * This method is used for starting the trip
   * @param {string} tripId
   * @param {UserDocument} user
   * @param {number} actualKms
   */
  async complete(user: UserDocument, tripId: string, actualKms: number) {
    try {
      const trip = await this.getById(tripId);
      if (trip.status != TripStatus.IN_PROGRESS) {
        throw new HttpException(
          'Only in-progress trips can be completed',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (trip.assignedTo != user._id) {
        throw new HttpException(
          'This trip is not assigned to you.',
          HttpStatus.BAD_REQUEST,
        );
      }

      await trip.update({ status: TripStatus.COMPLETED, actualKms });
    } catch (error) {
      throw error;
    }
  }

  /**
   * This method is used for starting the trip
   * @param {Express.Multer.File} file
   * @param {UserDocument} user
   * @param {string} tripId
   */
  async uploadPOD(
    user: UserDocument,
    file: Express.Multer.File,
    tripId: string,
  ) {
    try {
      const trip = await this.getById(tripId);
      if (trip.status != TripStatus.COMPLETED) {
        throw new HttpException(
          'You can upload POD only for completed trips',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (trip.assignedTo != user._id) {
        throw new HttpException(
          'This trip is not assigned to you.',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * This method is used for creating trip
   * @param {TripDTO} tripDTO
   * @return {Promise}
   */
  async create(tripDTO: TripDTO): Promise<TripDetailsDTO> {
    try {
      const { assignedTo, rateCard } = tripDTO;
      let assignedToId: MongooseSchema.Types.ObjectId;
      let rateCardId: MongooseSchema.Types.ObjectId;
      if (assignedTo) {
        const user = await this.userService.getById(assignedTo);
        assignedToId = user._id;
      }
      if (rateCard) {
        const rateCardObject = await this.rateCardService.getById(rateCard);
        rateCardId = rateCardObject._id;
      }
      const doc: Trip = {
        ...tripDTO,
        assignedTo: assignedToId,
        rateCard: rateCardId,
      };

      const createdTrip = new this.tripModel(doc);

      return createdTrip.save();
    } catch (error) {
      throw error;
    }
  }
}

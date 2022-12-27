import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { UserDocument } from 'src/modules/user/schemas/user.schema';
import { POD, PODDocument } from '../schemas/pod.schema';
import { TripService } from 'src/modules/trip/v1/trip.service';
import { PODDetailsDTO } from './dto/podDetails.dto';
import { TripStatus } from 'src/modules/trip/enum/tripStatus.enum';
import { PODStatus } from '../enum/podStatus.enum';
import {
  PaymentRequest,
  PaymentRequestDocument,
} from '../schemas/paymentRequest.schema';
import { RateCardService } from 'src/modules/rateCard/v1/rateCard.service';
import * as moment from 'moment';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(POD.name)
    private podModel: Model<PODDocument>,
    @InjectModel(PaymentRequest.name)
    private paymentRequestModel: Model<PaymentRequestDocument>,
    private readonly rateCardService: RateCardService,
    private readonly tripService: TripService,
    private readonly logger: Logger,
  ) {}

  /**
   * This method is used for fetching payment requests
   * @param {number} pageSize
   * @param {number} page
   */
  async get(page: number, pageSize?: number) {
    const offset = (page ?? 0) * (pageSize ?? 10);
    return this.paymentRequestModel
      .find()
      .sort({ _id: 1 })
      .skip(offset)
      .limit(pageSize ?? 10);
  }

  /**
   * This method is used for fetching proof of deliveries
   * @param {number} pageSize
   * @param {number} page
   */
  async getPOD(page: number, pageSize?: number) {
    const offset = (page ?? 0) * (pageSize ?? 10);
    return this.podModel
      .find()
      .sort({ _id: 1 })
      .skip(offset)
      .limit(pageSize ?? 10);
  }

  async getById(id: string) {
    const pod = await this.podModel.findOne({ _id: id });
    if (pod) {
      return pod;
    }
    throw new HttpException(
      'Proof of delivery with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  /**
   * This method is used for uploading POD for the trip
   * @param {Express.Multer.File} file
   * @param {UserDocument} user
   * @param {string} tripId
   */
  async create(
    user: UserDocument,
    file: string,
    tripId: string,
  ): Promise<PODDetailsDTO> {
    try {
      const trip = await this.tripService.getById(tripId);
      if (trip.status != TripStatus.COMPLETED) {
        throw new HttpException(
          'You can upload POD only for completed trips',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!user._id.equals(trip.assignedTo)) {
        throw new HttpException(
          'This trip is not assigned to you.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const doc: POD = {
        tripId: trip._id,
        pod: file,
      };
      const podDocument = await this.podModel.create(doc);
      return podDocument.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * This method is used for changing the status of trip
   * @param {boolean} isApproved
   * @param {string} podId
   */
  async approveRejectPOD(isApproved: boolean, podId: string) {
    try {
      const pod = await this.getById(podId);
      await pod.update({
        status: isApproved ? PODStatus.APPROVED : PODStatus.REJECTED,
      });
      if (isApproved) {
        await this._createPaymentRequest(pod.tripId);
      }
    } catch (error) {
      throw error;
    }
  }

  async _createPaymentRequest(tripId: MongooseSchema.Types.ObjectId) {
    try {
      const trip = await this.tripService.getById(tripId);
      const rateCard = await this.rateCardService.getById(trip.rateCard);

      const tripAmount: number = trip.actualKms * rateCard.price;

      let incentive: number;
      if (trip.actualKms > trip.totalKms) {
        incentive = (trip.actualKms - trip.totalKms) * rateCard.incentive;
      }

      let penalty: number;
      const delayedMins = moment(trip.actualStartTime).diff(
        moment(trip.startTime),
        'minutes',
      );
      if (delayedMins > 0) {
        penalty = delayedMins * rateCard.penalty;
      }

      const doc: PaymentRequest = {
        tripId,
        tripAmount,
        incentive,
        penalty,
      };

      const paymentRequest = await this.paymentRequestModel.create(doc);
      await paymentRequest.save();
    } catch (error) {
      throw error;
    }
  }
}

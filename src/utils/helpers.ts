import { HttpException, HttpStatus } from '@nestjs/common';

export class Helper {
  public static errorHelper(err: any): HttpException {
    if (err instanceof HttpException) {
      throw err;
    }
    throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

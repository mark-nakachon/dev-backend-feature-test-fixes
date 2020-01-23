import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import * as _ from 'lodash';

/**
 * Filter for all exception. It will handle normal HttpException,
 * Validation error from class-validator, and error from SOAP service.
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : _.get(exception, 'status', HttpStatus.INTERNAL_SERVER_ERROR);
    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      if (_.isObject(exception.message)) {
        if (_.isArray(exception.message.message)) {
          // validation error details
          const details = exception.message.message;
          message = _.join(_.values(details[0].constraints), ',');
        } else {
          message = exception.message.message;
        }
      } else {
        message = exception.message;
      }
    }

    response.status(status).json({
      code: status,
      message,
    });
  }
}

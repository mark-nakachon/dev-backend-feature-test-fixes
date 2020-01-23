import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/**
 * Pipe to parse integer from given value.
 */
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    if (/^[1-9]\d*$/.test(value)) {
      return parseInt(value, 10);
    } else {
      throw new HttpException(
        `${metadata.data} must be a positive integer.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';
import * as _ from 'lodash';

/**
 * Sequlize helper method to find entity with given primary key.
 *
 * @param modelName the sequlize model name
 * @param model the sequlize model
 * @param id the id(primary key)
 * @param status the http status if not found
 * @param options the options
 *
 * @returns a promise with specified sequlize model
 */
export async function findByPk(
  modelName: string,
  model: any,
  id: number,
  status = HttpStatus.BAD_REQUEST,
  options = {},
): Promise<any> {
  const result = await model.findByPk(id, options);
  if (_.isNil(result)) {
    throw new HttpException(
      `${modelName} not found with given id: ${id}`,
      status,
    );
  }
  return result;
}

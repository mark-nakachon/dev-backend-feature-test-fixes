import { HttpException, HttpStatus } from '@nestjs/common';
import { get } from 'config';
import * as soap from 'soap';

/**
 * Wraps a soap call.
 *
 * @param fn a function with soap method and request object
 * @param option a option for create soap client
 *
 * @returns a promise with specified object
 */
export function wrapSoapCall<T>(
  fn: (arg0: soap.Client) => (arg0: (err: any, result: any) => void) => void,
  option: any,
) {
  return new Promise<T>((resolve, reject) =>
    soap.createClient(get('SOAP_URL'), option, (err, client) => {
      if (err) {
        reject(err);
      } else {
        fn(client)((e, result) => {
          if (e) {
            reject(new HttpException(e.message, HttpStatus.BAD_REQUEST));
          } else {
            if (typeof result === 'string') {
              result = JSON.parse(result);
            }
            resolve(result);
          }
        });
      }
    }),
  );
}

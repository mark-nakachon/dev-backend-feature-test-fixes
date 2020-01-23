import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

/**
 * Authenticated user decorator, it will return a User entity.
 */
export const AuthUser = createParamDecorator((data: string, req: Request) => {
  // tslint:disable-next-line
  return req['user'];
});

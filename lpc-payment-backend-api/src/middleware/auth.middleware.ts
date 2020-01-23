import {
  Inject,
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from '../entities';
import * as _ from 'lodash';

/**
 * Middleware for perform authentication operation.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject('UsersRepository') private usersRepository: typeof User,
  ) {}

  use(req: Request, res: Response, next: (err?: any, res?: any) => void) {

    
    

    // tslint:disable-next-line
    const email = req['decoded'].email;
    // tslint:disable-next-line
    const tenantId = req.headers['x-tenant-id'];
    this.usersRepository
      .findOne({ where: { email, tenantId } })
      .then(user => {
        
        if (_.isNil(user)) {
          next(
            new HttpException(
              `User not found with email: ${email} and tenantId: ${tenantId}`,
              HttpStatus.UNAUTHORIZED,
            ),
          );
        } else {
          // tslint:disable-next-line
          req['user'] = user;
          next();
        }
      })
      .catch(e => next(e));
  }
}

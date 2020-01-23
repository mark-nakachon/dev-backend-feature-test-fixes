import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/**
 * Guard for admin role.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.user.isAdmin) {
      return true;
    } else {
      throw new HttpException(
        'Only admin is allowed to perform this operation',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}

import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { SKIP_PERMISSION } from 'src/common/decorators/skip-permission.decorator';

@Injectable()
export class PermissionGuard extends AuthGuard('permission') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());

    // Pass through for public api
    if (isPublic) return true;

    const isSkipPermission = this.reflector.get(
      SKIP_PERMISSION,
      context.getHandler(),
    );

    // Pass through for public api
    if (isSkipPermission) return true;

    console.log('CAN Active');
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

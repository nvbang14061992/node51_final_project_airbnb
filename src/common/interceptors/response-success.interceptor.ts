import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MESSAGE_RESPONSE } from '../decorators/message-response.decorator';

@Injectable()
export class ResponseSuccessInterceptor implements NestInterceptor {
  constructor(private relfector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { statusCode } = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        const message = this.relfector.get(
          MESSAGE_RESPONSE,
          context.getHandler(),
        );

        // delete password from data if exist
        delete data.password;
        return {
          status: 'success',
          statusCode: statusCode,
          message:
            message || "Gan decorator 'MessageResponse' vao controller di",
          data: data,
        };
      }),
    );
  }
}

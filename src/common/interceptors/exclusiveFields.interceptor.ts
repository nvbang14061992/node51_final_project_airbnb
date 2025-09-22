import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EXCLUDE_FIELDS_KEY } from '../decorators/exclude-fields.decorator';

@Injectable()
export class ExcludeFieldsInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handlerFields =
      this.reflector.get<string[]>(EXCLUDE_FIELDS_KEY, context.getHandler()) ||
      [];

    const classFields =
      this.reflector.get<string[]>(EXCLUDE_FIELDS_KEY, context.getClass()) ||
      [];
    // Merge and deduplicate
    const fieldsToExclude = [...new Set([...classFields, ...handlerFields])];

    return next.handle().pipe(
      map((data) => {
        const clean = (item: any) => {
          if (item && typeof item === 'object') {
            fieldsToExclude.forEach((field) => delete item[field]);
          }
          return item;
        };

        if (Array.isArray(data)) {
          return data.map(clean);
        }

        return clean(data);
      }),
    );
  }
}

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
    // Get meta data from CRUD methods with given keyword EXCLUDE_FIELDS_KEY
    const handlerFields =
      this.reflector.get<string[]>(EXCLUDE_FIELDS_KEY, context.getHandler()) ||
      [];

    const classFields =
      this.reflector.get<string[]>(EXCLUDE_FIELDS_KEY, context.getClass()) ||
      [];
    // Merge and deduplicate exclusive fields
    const fieldsToExclude = [...new Set([...classFields, ...handlerFields])];

    return next.handle().pipe(
      map((data) => {
        // Remove fields from res data
        const clean = (item: any): any => {
          if (Array.isArray(item)) {
            return item.map(clean);
          }

          if (item && typeof item === 'object' && item.constructor === Object) {
            const result = { ...item };
            fieldsToExclude.forEach((field) => {
              delete result[field];
            });

            // Recursively clean nested properties
            for (const key of Object.keys(result)) {
              result[key] = clean(result[key]);
            }

            return result;
          }

          return item;
        };

        return clean(data);
      }),
    );
  }
}

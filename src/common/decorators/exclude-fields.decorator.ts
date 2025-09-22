// exclude-fields.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const EXCLUDE_FIELDS_KEY = 'exclude_fields';

export const ExcludeFields = (...fields: string[]) => {
  return SetMetadata(EXCLUDE_FIELDS_KEY, fields);
};

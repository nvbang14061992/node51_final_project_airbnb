import { Module } from '@nestjs/common';
import { ImageFileValidationPipe } from './file-validation.service';

@Module({
  providers: [ImageFileValidationPipe],
  exports: [ImageFileValidationPipe], // 👈 Export if used outside this module
})
export class FileValidationModule {}

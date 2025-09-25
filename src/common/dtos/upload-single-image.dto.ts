import { ApiProperty } from '@nestjs/swagger';

export class UploadSingleImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;
}

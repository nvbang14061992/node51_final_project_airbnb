import { ApiProperty } from '@nestjs/swagger';

export class UploadSingleDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}

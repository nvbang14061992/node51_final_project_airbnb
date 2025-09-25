import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Bai sau - Vung tau' })
  ten_vi_tri: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Ho Chi Minh' })
  tinh_thanh: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Viet Nam' })
  quoc_gia: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '' })
  hinh_anh: string;
}

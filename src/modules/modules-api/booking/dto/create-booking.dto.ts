import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: '1' })
  ma_phong: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: '2025-10-01' })
  ngay_den: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ example: '2025-10-02' })
  ngay_di: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(1000)
  @ApiProperty({ example: '1' })
  so_luong_khach: number;
}

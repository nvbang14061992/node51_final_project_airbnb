import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 1 })
  ma_phong: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Phong that dep' })
  noi_dung: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 5 })
  sao_binh_luan: number;
}

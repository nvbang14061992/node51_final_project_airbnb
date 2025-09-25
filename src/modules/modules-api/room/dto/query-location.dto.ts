import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class QueryRoomLocationDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 1 })
  ma_vi_tri: number;
}

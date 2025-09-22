import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class QueryRoomIdDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 1 })
  maPhong: number;
}

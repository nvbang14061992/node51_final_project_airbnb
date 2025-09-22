import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  Min,
} from 'class-validator';

export class QueryRoomDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 1 })
  page: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 2 })
  pageSize: number;

  @IsJSON()
  @IsOptional()
  @ApiProperty({ example: '{"ten_phong": "phong 1"}', required: false })
  filtersStringJson: string;
}

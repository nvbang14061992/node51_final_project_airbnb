import { ApiProperty } from '@nestjs/swagger';

import {
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  Min,
} from 'class-validator';

export class QueryLocationDto {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1 })
  page: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 2 })
  pageSize: number;

  @IsJSON()
  @IsOptional()
  @ApiProperty({ example: '{"ten_vi_tri": "ho chi minh"}', required: false })
  filtersStringJson: string;
}

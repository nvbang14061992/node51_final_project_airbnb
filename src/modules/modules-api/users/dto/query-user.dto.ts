import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class QueryUserDto {
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
  @ApiProperty({ example: '{"ten": "1"}', required: false })
  filtersStringJson: string;
}

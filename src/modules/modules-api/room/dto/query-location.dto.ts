import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class QueryRoomLocationDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  locationId: number;
}

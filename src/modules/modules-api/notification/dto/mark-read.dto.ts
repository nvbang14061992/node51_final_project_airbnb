// src/notification/dto/mark-read.dto.ts
import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class MarkReadDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}

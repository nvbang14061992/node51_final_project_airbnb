import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRoomDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Căn hộ HCM 1', required: false })
  ten_phong: string | null | undefined;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 1, required: false })
  chu_so_huu: number | null | undefined;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 1, required: false })
  ma_vi_tri: number | null | undefined;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 2, required: false })
  khach: number | null | undefined;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({ example: 3, required: false })
  phong_ngu: number | null | undefined = 1;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1, required: false })
  giuong: number | null | undefined = 0;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 1, required: false })
  phong_tam: number | null | undefined = 0;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Căn hộ tiện nghi trung tâm HCM', required: false })
  mo_ta: string | null | undefined;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 600000, required: false })
  gia_tien: number | null | undefined = 0;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  may_giat: boolean | null | undefined = true;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  ban_ui: boolean | null | undefined = true;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  tivi: boolean | null | undefined = true;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  dieu_hoa: boolean | null | undefined = true;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  wifi: boolean | null | undefined = true;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  bep: boolean | null | undefined = true;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  do_xe: boolean | null | undefined = true;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  ho_boi: boolean | null | undefined = true;
}

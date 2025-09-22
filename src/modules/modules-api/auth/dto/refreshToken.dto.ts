import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'accessTokenfskjshfj' })
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'refeshTokenfskjshfj' })
  refreshToken: string;
}

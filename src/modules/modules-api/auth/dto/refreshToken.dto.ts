import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

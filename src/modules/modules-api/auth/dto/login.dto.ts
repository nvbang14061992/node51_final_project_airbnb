import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, isString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'user@abc.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'pass123' })
  password: string;
}

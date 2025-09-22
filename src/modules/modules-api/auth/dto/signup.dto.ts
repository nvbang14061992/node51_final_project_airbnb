import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'user@abc.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'pass123' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'NewUser' })
  name: string;

  @IsString()
  @ApiProperty({ example: '+84983484257' })
  phone: string = '';

  @IsString()
  @ApiProperty({ example: '22Seb2025' })
  birthday: string = '';

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: true })
  gender: boolean;
}

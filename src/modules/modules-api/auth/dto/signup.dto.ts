import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  phone: string = '';

  @IsString()
  birthday: string = '';

  @IsBoolean()
  @IsNotEmpty()
  gender: boolean;
}

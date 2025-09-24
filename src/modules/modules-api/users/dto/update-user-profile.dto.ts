import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { SignupDto } from '../../auth/dto/signup.dto';
import { IsOptional } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';

export class UpdateUserProfileDto extends PickType(SignupDto, [
  'name',
  'phone',
  'birthday',
  'gender',
] as const) {
  @IsOptional()
  name: string;

  @IsOptional()
  gender: boolean;
}

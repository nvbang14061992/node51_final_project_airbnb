import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { SignupDto } from '../../auth/dto/signup.dto';

export class UpdateUserDto extends PartialType(SignupDto) {}

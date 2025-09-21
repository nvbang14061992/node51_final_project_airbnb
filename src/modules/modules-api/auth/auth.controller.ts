import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessageResponse('Login successfully!!!')
  @Post('/login')
  @Public()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @MessageResponse('Register successfully!!!')
  @Post('/signup')
  @Public()
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @MessageResponse('Refresh tokens successfully!!!')
  @Post('/refresh-token')
  @Public()
  refreshToken(@Body() refeshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refeshTokenDto);
  }
}

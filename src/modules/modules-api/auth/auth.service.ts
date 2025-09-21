import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/modules/modules-system/token/token.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const userExist = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!userExist)
      throw new BadRequestException(
        `Email ${email} not found, please register first`,
      );

    if (!userExist.password) {
      throw new BadRequestException(
        'Vui long dang nhap bang mang xa hoi (gmail, facebook',
      );
    }

    const isPasswordValid = bcrypt.compareSync(password, userExist.password);
    if (!isPasswordValid) throw new BadRequestException(`Invalid password`);

    // return tokens
    const tokens = this.tokenService.createTokens(userExist.id);

    return tokens;
  }

  async signup(signupDto: SignupDto) {
    const { email, password, name, phone, birthday, gender } = signupDto;

    const userExist = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (userExist) {
      throw new BadRequestException(`Email ${email} already exists`);
    }

    // Hash the password before saving
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await this.prisma.users.create({
      data: {
        email: email,
        password: hashedPassword,
        ten: name,
        so_dien_thoai: phone,
        ngay_sinh: birthday,
        gioi_tinh: gender,
      },
    });

    return true;
  }
}
